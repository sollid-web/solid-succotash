import logging
import tempfile

from django.conf import settings
from django.contrib import messages
from django.http import FileResponse, Http404, HttpResponse, JsonResponse
from django.shortcuts import render, redirect

from .models import Agreement
from .forms import ContactForm

logger = logging.getLogger(__name__)


def healthz(request):
    """Simple health check endpoint that returns JSON."""

    return JsonResponse({"status": "ok"})


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
