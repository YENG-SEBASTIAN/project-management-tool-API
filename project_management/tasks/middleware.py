class FrontendBaseUrlMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Extract base URL from request headers, or construct it dynamically
        frontend_base_url = self.extract_frontend_base_url(request)
        # Add 'frontend_base_url' to request object for use in views or serializers
        request.frontend_base_url = frontend_base_url
        
        response = self.get_response(request)
        return response

    def extract_frontend_base_url(self, request):
        # Example: Extract base URL from 'Referer' header
        referer = request.headers.get('Referer', None)
        if referer:
            return referer
        # If header not present or doesn't contain base URL, construct dynamically
        return request.scheme + '://' + request.get_host()  # Defaulting to request's host

