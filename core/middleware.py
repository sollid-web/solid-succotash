import uuid

from django.utils.deprecation import MiddlewareMixin

class RequestIDMiddleware(MiddlewareMixin):
    """
    Middleware to inject a unique X-Request-ID header into every request/response.
    """
    def process_request(self, request):
        request_id = request.META.get('HTTP_X_REQUEST_ID') or str(uuid.uuid4())
        request.request_id = request_id
        request.META['HTTP_X_REQUEST_ID'] = request_id

    def process_response(self, request, response):
        request_id = getattr(request, 'request_id', None) or request.META.get('HTTP_X_REQUEST_ID')
        if request_id:
            response['X-Request-ID'] = request_id
        return response
