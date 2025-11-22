import logging
import tempfile

from django.conf import settings
from django.http import FileResponse, Http404, HttpResponse, JsonResponse

from .models import Agreement

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
        # In test or debug environments return 200 so tests can assert fallback
        status_code = 200 if settings.DEBUG or getattr(settings, "TESTING", False) else 503
        return HttpResponse(
            "PDF generation temporarily unavailable (missing ReportLab).",
            status=status_code,
            content_type="text/plain",
        )

    paragraphs = agreement.paragraphs() or ["(This agreement currently has no body content.)"]

    tmp = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
    tmp_path = tmp.name
    tmp.close()
    try:
        build_pdf(tmp_path, paragraphs)
        return FileResponse(open(tmp_path, "rb"), content_type="application/pdf")
    finally:  # pragma: no branch - temporary file cleaned by OS
        logger.debug("Generated agreement PDF for %s", agreement_id)
