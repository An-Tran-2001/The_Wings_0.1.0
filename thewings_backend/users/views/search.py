from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.views import APIView
from thewings_backend.users.renderers import UserRenderer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from thewings_backend.users.serializers import SearchUserSerializer
from thewings_backend.users.api.serializers import UserSerializer
from django.contrib.auth import get_user_model

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
            return Response(
                UserSerializer(
                    User.objects.filter(
                        name__icontains=serializer.data.get("key_name")
                    ),
                    many=True,
                    context={"request": request},
                ).data,
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


search_user_view = SearchUser().as_view()
