from rest_framework.views import APIView
from thewings_backend.users.serializers import (
    UserRegisterSerializer,
    SubmitCodeSerializer,
    SendNewCodeSerializer,
)
from thewings_backend.users.processing.email import email, code, recode
from rest_framework.response import Response
from rest_framework import status
from thewings_backend.users.renderers import UserRenderer
from thewings_backend.utils import Util
import random
from thewings_backend.users.processing.env_variables import redis_cache, redis_instance
import json
from thewings_backend.users.tasks import send_email_signup, resend_email_signup
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from thewings_backend.docs.auth import register_docs


class UserRegisterView(APIView):
    renderer_classes = (UserRenderer,)
    serializer_class = UserRegisterSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @register_docs()
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            send_email_signup.delay(request.data)
            return Response(
                {"data": serializer.data, "message": "Send email success"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateRegisterView(APIView):
    renderer_classes = (UserRenderer,)
    serializer_class = SubmitCodeSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def post(self, request):
        serializer = SubmitCodeSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get("email")
            code = serializer.data.get("code")
            keys = redis_instance.keys(f"{email}_*")
            if len(keys) == 0:
                return Response(
                    {"msg": "Email is not valid"}, status=status.HTTP_400_BAD_REQUEST
                )
            key = f"{email}_code"
            value = f"{email}_value"
            if redis_instance.ttl(key) == -1:
                return Response(
                    {"msg": "Code is expired"}, status=status.HTTP_400_BAD_REQUEST
                )
            elif redis_instance.ttl(key) == -2:
                return Response(
                    {"msg": "Code is expired"}, status=status.HTTP_400_BAD_REQUEST
                )
            if int(redis_instance.get(key)) == int(code):
                data = json.loads(redis_instance.get(value))
                serializer = UserRegisterSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    redis_instance.delete(key)
                    redis_instance.delete(value)
                    return Response(
                        {"data": serializer.data, "message": "Create user success"},
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(
                    {"detail": "Code is not correct"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendNewCodeView(APIView):
    renderer_classes = (UserRenderer,)
    serializer_class = SendNewCodeSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def post(self, request):
        serializer = SendNewCodeSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get("email")
            resend_email_signup.delay(email)
            return Response(
                {"data": serializer.data, "message": "Send email success"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


recode_register_view = SendNewCodeView.as_view()
confirm_register_view = CreateRegisterView.as_view()
user_register_view = UserRegisterView.as_view()
