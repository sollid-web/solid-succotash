import threading, uuid
from django.utils.deprecation import MiddlewareMixin

_request_local = threading.local()

def get_request_id():  # helper for formatters
    return getattr(_request_local, 'request_id', None)

class RequestIDMiddleware(MiddlewareMixin):
    """Assign a unique request id (UUID4) to each request for trace correlation."""
    def process_request(self, request):  # pragma: no cover (simple assignment)
        rid = uuid.uuid4().hex
        _request_local.request_id = rid
        request.request_id = rid

    def process_response(self, request, response):  # pragma: no cover
        rid = getattr(request, 'request_id', None)
        if rid:
            response.headers['X-Request-ID'] = rid
        return response
