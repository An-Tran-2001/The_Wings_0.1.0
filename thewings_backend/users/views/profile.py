from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from thewings_backend.custom_permission import IsAcessToken
from thewings_backend.users.models import Profile
from thewings_backend.users.renderers import UserRenderer
from thewings_backend.users.serializers import UserCreateProfileSerializer, UserUpdateProfile
from thewings_backend.users.api.serializers import UserSerializer
User = get_user_model()

class UserCreateProfileView(APIView):
    render_class = [UserRenderer]
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    permission_classes = [IsAuthenticated & IsAcessToken]
    serializer_class = UserCreateProfileSerializer

    def post(self, request, format=None):
        serializer = UserCreateProfileSerializer(
            data=request.data, context={"user": request.user}
        )
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user = User.objects.get(id=request.user.id)
            return Response(
                UserSerializer(user, context={'request': request}).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

user_create_profile_view = UserCreateProfileView.as_view()
