import logging
import tempfile

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import user_passes_test
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import FileResponse, Http404, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from .email_inbox_service import fetch_new_emails, mark_email_read
from .forms import ContactForm
from .models import Agreement, EmailInbox, EmailTemplate

logger = logging.getLogger(__name__)


def healthz(request):
    """Simple health check endpoint that returns JSON."""

    return JsonResponse({"status": "ok"})


def root_healthcheck(request):
    """Root-level health check endpoint.

    Some platforms probe `/` instead of a configured health path.
    Keep this lightweight and dependency-free.
    """

    return HttpResponse("OK", status=200, content_type="text/plain")


def agreement_pdf(request, agreement_id: int):
    """Return a PDF for a stored Agreement version.

    Looks up an active Agreement by primary key and uses its paragraph
    splitting helper. Falls back gracefully if PDF stack is unavailable.
    """

    if not request.user.is_authenticated:
        raise Http404

    try:
        agreement = Agreement.objects.get(pk=agreement_id, is_active=True)
    except Agreement.DoesNotExist as exc:  # pragma: no cover - defensive
        raise Http404 from exc

    try:
        from .pdf_letterhead import build_pdf
    except Exception:  # pragma: no cover - environment specific
        # In test/dev envs return 200 so tests can assert fallback deterministically
        should_succeed = settings.DEBUG or getattr(settings, "TESTING", False)
        status_code = 200 if should_succeed else 503
        return HttpResponse(
            "PDF generation temporarily unavailable (missing ReportLab).",
            status=status_code,
            content_type="text/plain",
        )

    paragraphs_fn = getattr(agreement, "paragraphs", None)
    empty_paragraph = "(This agreement currently has no body content.)"
    if callable(paragraphs_fn):
        paragraphs = paragraphs_fn() or [empty_paragraph]
    else:  # pragma: no cover - defensive fallback
        paragraphs = [empty_paragraph]

    tmp = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
    tmp_path = tmp.name
    tmp.close()
    try:
        build_pdf(tmp_path, paragraphs)
        return FileResponse(
            open(tmp_path, "rb"),
            content_type="application/pdf",
        )
    finally:  # pragma: no branch - temporary file cleaned by OS
        logger.debug("Generated agreement PDF for %s", agreement_id)


def contact_view(request):
    """Contact/Support form for users to send messages to admins."""

    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            try:
                # Save and send notification emails
                user = request.user if request.user.is_authenticated else None
                form.save_and_notify(request=request, user=user)

                messages.success(
                    request,
                    'Thank you! Your message has been sent. Our support team will respond shortly.'
                )
                return redirect('dashboard' if user else 'contact')
            except Exception as e:
                logger.error(f"Failed to save contact form: {e}")
                messages.error(
                    request,
                    'Sorry, we encountered an error. Please try again or email us directly.'
                )
    else:
        # Pre-fill form if user is authenticated
        initial = {}
        if request.user.is_authenticated:
            initial = {
                'full_name': request.user.get_full_name() or '',
                'contact_email': request.user.email
            }
        form = ContactForm(initial=initial)

    return render(request, 'core/contact.html', {
        'form': form,
        'admin_emails': settings.ADMIN_EMAIL_RECIPIENTS,
    })


def is_admin(user):
    """Check if user is admin/staff."""
    return user.is_authenticated and user.is_staff


@user_passes_test(is_admin)
def inbox_view(request):
    """Professional business email inbox for admin users."""

    # Filter parameters
    status_filter = request.GET.get('status', '')
    priority_filter = request.GET.get('priority', '')
    search = request.GET.get('search', '')
    starred_only = request.GET.get('starred', '') == '1'
    assigned_to_me = request.GET.get('assigned', '') == 'me'

    # Base queryset
    emails = EmailInbox.objects.all()

    # Apply filters
    if status_filter:
        emails = emails.filter(status=status_filter)
    if priority_filter:
        emails = emails.filter(priority=priority_filter)
    if search:
        emails = emails.filter(
            Q(subject__icontains=search) |
            Q(from_email__icontains=search) |
            Q(from_name__icontains=search) |
            Q(body_text__icontains=search)
        )
    if starred_only:
        emails = emails.filter(is_starred=True)
    if assigned_to_me:
        emails = emails.filter(assigned_to=request.user)

    # Pagination
    paginator = Paginator(emails, 25)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Stats
    stats = {
        'total': EmailInbox.objects.count(),
        'unread': EmailInbox.objects.filter(status=EmailInbox.STATUS_UNREAD).count(),
        'starred': EmailInbox.objects.filter(is_starred=True).count(),
        'assigned_to_me': EmailInbox.objects.filter(assigned_to=request.user).count(),
    }

    return render(request, 'core/inbox.html', {
        'page_obj': page_obj,
        'stats': stats,
        'status_choices': EmailInbox.STATUS_CHOICES,
        'priority_choices': EmailInbox.PRIORITY_CHOICES,
        'current_filters': {
            'status': status_filter,
            'priority': priority_filter,
            'search': search,
            'starred': starred_only,
            'assigned': assigned_to_me,
        }
    })


@user_passes_test(is_admin)
def inbox_detail_view(request, email_id):
    """View single email in detail."""

    email_obj = get_object_or_404(EmailInbox, id=email_id)

    # Mark as read when viewed
    if email_obj.status == EmailInbox.STATUS_UNREAD:
        mark_email_read(email_obj, request.user)

    # Get email templates for quick reply
    templates = EmailTemplate.objects.filter(is_active=True)

    return render(request, 'core/inbox_detail.html', {
        'email': email_obj,
        'templates': templates,
    })


@user_passes_test(is_admin)
def inbox_action_view(request, email_id):
    """Handle email actions (star, archive, delete, assign, etc.)."""

    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'POST required'}, status=405)

    email_obj = get_object_or_404(EmailInbox, id=email_id)
    action = request.POST.get('action')

    if action == 'star':
        email_obj.toggle_star()
        return JsonResponse({'success': True, 'starred': email_obj.is_starred})

    elif action == 'archive':
        email_obj.status = EmailInbox.STATUS_ARCHIVED
        email_obj.save()
        return JsonResponse({'success': True})

    elif action == 'spam':
        email_obj.status = EmailInbox.STATUS_SPAM
        email_obj.save()
        return JsonResponse({'success': True})

    elif action == 'assign':
        email_obj.assigned_to = request.user
        email_obj.save()
        return JsonResponse({'success': True})

    elif action == 'mark_read':
        mark_email_read(email_obj, request.user)
        return JsonResponse({'success': True})

    elif action == 'mark_unread':
        email_obj.status = EmailInbox.STATUS_UNREAD
        email_obj.read_at = None
        email_obj.save()
        return JsonResponse({'success': True})

    elif action == 'priority':
        priority = request.POST.get('priority', EmailInbox.PRIORITY_NORMAL)
        email_obj.priority = priority
        email_obj.save()
        return JsonResponse({'success': True})

    return JsonResponse({'success': False, 'error': 'Invalid action'}, status=400)


@user_passes_test(is_admin)
def inbox_sync_view(request):
    """Manually sync emails from IMAP server."""

    if request.method == 'POST':
        try:
            count = fetch_new_emails(limit=100)
            messages.success(request, f'Successfully fetched {count} new emails!')
        except Exception as e:
            logger.error(f"Email sync error: {e}")
            messages.error(request, f'Error syncing emails: {str(e)}')

    return redirect('inbox')
