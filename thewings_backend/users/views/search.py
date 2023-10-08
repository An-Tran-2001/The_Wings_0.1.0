from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.views import APIView
from thewings_backend.users.renderers import UserRenderer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from thewings_backend.users.serializers import SearchUserSerializer
from thewings_backend.users.api.serializers import UserSerializer, OrtherUserSerializer
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()


class SearchUser(APIView):
    enderer_classes = (UserRenderer,)
    serializer_class = SearchUserSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            current_user = request.user
            key_name = serializer.data.get("key_name")
            return Response(
                UserSerializer(
                    User.objects.filter(
                        Q(name__icontains=key_name) & ~Q(id=current_user.id)
                    ),
                    many=True,
                    context={"request": request},
                ).data,
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetUser(APIView):
    enderer_classes = (UserRenderer,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            return Response(
                OrtherUserSerializer(
                    user,
                    context={"request": request},
                ).data,
                status=status.HTTP_200_OK,
            )
        except:
            return Response(
                {"message": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


search_user_view = SearchUser().as_view()
get_user_view = GetUser().as_view()