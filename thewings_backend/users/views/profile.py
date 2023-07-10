from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from ..renderers import UserRenderer
from ..serializers import UserCreateProfileSerializer
from ..models import Profile
from thewings_backend.custom_permission import IsAcessToken
from rest_framework.permissions import IsAuthenticated


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
            return Response(
                {"msg": "Profile Successfully Created"}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        try:
            profile = Profile.objects.get(user=request.user.id)
            return (
                Response({"msg": "have a profile"}, status=status.HTTP_200_OK)
                if profile is not None
                else Response({"msg": "no profile"}, status=status.HTTP_404_NOT_FOUND)
            )
        except Profile.DoesNotExist:
            return Response({"msg": "no profile"}, status=status.HTTP_404_NOT_FOUND)


user_create_profile_view = UserCreateProfileView.as_view()
