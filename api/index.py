from wolvcapital.wsgi import application

def handler(request):
    """ASGI handler for Vercel serverless functions."""
    return application(request.environ, request.start_response)
