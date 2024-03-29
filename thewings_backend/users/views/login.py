import datetime

from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from thewings_backend.docs.auth import login_docs
from thewings_backend.users.processing.env_variables import get_token_for_user
from thewings_backend.users.renderers import UserRenderer
from thewings_backend.users.serializers import UserLoginSerializer
from thewings_backend.users.api.serializers import UserSerializer

User = get_user_model()


class UserLoginView(APIView):
    renderer_classes = (UserRenderer,)
    serializer_class = UserLoginSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @login_docs()
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username_email = serializer.data.get("username_email")
            password = serializer.data.get("password")
            user = (
                User.objects.filter(email=username_email).first()
                if "@" in username_email
                else User.objects.filter(username=username_email).first()
            )
            if user is None:
                return Response(
                    {"detail": "User is not valid"}, status=status.HTTP_400_BAD_REQUEST
                )
            else: 
                user = authenticate(username=user.username, password=password)
                if user is not None:
                    token = get_token_for_user(user)
                    user.last_login = datetime.datetime.now()
                    user.is_active = True
                    user.save()
                    return Response(
                        {"message": "Login success", "user": UserSerializer(user, context={"request": request}).data ,"token": token},
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {"message": "Password is not valid"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


user_login_view = UserLoginView.as_view()
