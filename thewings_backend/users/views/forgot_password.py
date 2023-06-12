from rest_framework.views import APIView
from ..serializers import ResetPasswordSerializer, SendMailForgotPasswordSerializer
from rest_framework.response import Response
from rest_framework import status
from ..renderers import UserRenderer
from ...utils import Util
import random
from .processing.env_variables import redis_instance
from django.contrib.auth import get_user_model
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

User = get_user_model()


class UserForgotPasswordView(APIView):
    renderer_classes = (UserRenderer,)
    serializer_class = SendMailForgotPasswordSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
    
    def post(self, request):
        serializer = SendMailForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            name = User.objects.get(email=email).name
            code = random.randint(100000, 999999)
            body = {
                'email_subject': 'The wings send to you',
                'email_body': 'Hi ' + name + ', ' + 'your code is ' + str(code),
                'to_email': email,
            }
            # gửi lên mailhog
            Util.send_email(body)

            # lưu redis
            key = f"{email}_code_forgot"
            redis_instance.set(key, code)
            redis_instance.expire(key, 300)
            return Response({'data': serializer.data, 'message': 'Send email success'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserResetPasswordView(APIView):
    renderer_classes = (UserRenderer,)
    serializer_class = ResetPasswordSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
    
    def put(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            code = serializer.data.get('code')
            key = f"{email}_code_forgot"
            if redis_instance.ttl(key) == -1:
                return Response({'msg': 'Code is expired'}, status=status.HTTP_400_BAD_REQUEST)
            elif redis_instance.ttl(key) == -2:
                return Response({'msg': 'Code is expired'}, status=status.HTTP_400_BAD_REQUEST)
            if int(redis_instance.get(key)) == int(code):
                serializer.save()
                redis_instance.delete(key)
                return Response({'msg': 'Reset password success'}, status=status.HTTP_201_CREATED)
            return Response({'msg': 'Code is not valid'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



user_forgot_password_view = UserForgotPasswordView.as_view()
user_reset_password_view = UserResetPasswordView.as_view()