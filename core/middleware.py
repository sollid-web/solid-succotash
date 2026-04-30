import threading
import uuid

from django.utils.deprecation import MiddlewareMixin

class WolvLanguageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Check URL/Query Params (?lang=no)
        lang = request.GET.get('lang')
        
        # 2. Check User Profile if authenticated
        if not lang and request.user.is_authenticated:
            try:
                lang = request.user.profile.language_preference
            except Exception:
                lang = None

        # 3. Fallback to Browser Headers (Accept-Language)
        if not lang:
            lang = translation.get_language_from_request(request)

        # 4. Final Fallback to Default
        if not lang or lang not in [l[0] for l in settings.LANGUAGES]:
            lang = settings.LANGUAGE_CODE

        translation.activate(lang)
        request.LANGUAGE_CODE = translation.get_language()
        
        response = self.get_response(request)
        
        # Ensure the cookie is set for the frontend to read
        response.set_cookie(settings.LANGUAGE_COOKIE_NAME, lang)
        return response


_request_local = threading.local()


def get_request_id():
    return getattr(_request_local, "request_id", None)


class RequestIDMiddleware(MiddlewareMixin):
    """
    Middleware to inject a unique X-Request-ID header into every request/response.
    """

    def process_request(self, request):
        request_id = request.META.get("HTTP_X_REQUEST_ID") or str(uuid.uuid4())
        request.request_id = request_id
        request.META["HTTP_X_REQUEST_ID"] = request_id

    def process_response(self, request, response):
        request_id = getattr(request, "request_id", None) or request.META.get("HTTP_X_REQUEST_ID")
        if request_id:
            response["X-Request-ID"] = request_id
        return response
