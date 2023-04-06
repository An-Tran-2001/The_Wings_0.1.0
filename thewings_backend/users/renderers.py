from rest_framework import renderers
import json 

class UserRenderer(renderers.JSONRenderer):
    charset = 'utf-8'
    def render(self, data, media_type=None, renderer_context=None):
        errors = data.get('errors', None)

        if errors is not None:
            return super(UserRenderer, self).render(data)

        token = data.get('token', None)

        if token is not None and isinstance(token, bytes):
            data['token'] = token.decode('utf-8')
        
        response = ''
        if 'ErrorDetail' in str(data):
            response = json.dumps({
                'errors': data
            })
        else:
            response = json.dumps(data)
        return response