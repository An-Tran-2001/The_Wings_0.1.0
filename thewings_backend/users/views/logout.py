from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..renderers import UserRenderer
from ..serializers import UserLogoutSerializer
from rest_framework.permissions import IsAuthenticated
import datetime
from .processing.env_variables import get_token_expiration_time, redis_instance
from ..custom_permission import IsAcessToken
from django.contrib.auth import get_user_model

User = get_user_model()

class UserLogoutView(APIView):
    renderer_classes = (UserRenderer,)
    serializer_class = UserLogoutSerializer
    permission_classes = [IsAuthenticated & IsAcessToken]

    def patch(self, request):
        email = request.user.email
        start_time = datetime.datetime.now()
        end_time = get_token_expiration_time(request.auth.token)
        time_stamp = end_time - start_time
        seconds = time_stamp.days * 24 * 60 * 60 + time_stamp.seconds        
        serializer = UserLogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        redis_instance.set(email, request.auth.token, seconds)
        User.objects.filter(email=email).update(is_active=False)
        try:
            request.auth.delete()
        except:
            pass
        return Response({'message': 'Logout success'}, status=status.HTTP_200_OK)
    
user_logout_view = UserLogoutView.as_view()