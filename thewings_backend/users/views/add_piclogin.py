from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from thewings_backend.users.models import PicLogin
from thewings_backend.users.renderers import UserRenderer
from thewings_backend.users.serializers.add_piclogin import AddPicsLoginSerializer
from thewings_backend.users.tasks import save_image_login


class AddPicsLogin(APIView):
    renderer_classes = (UserRenderer,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    serializer_class = AddPicsLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            save_image_login.delay(serializer.data)
            return Response(
                {"msg": "PicLogin Successfully Created"}, status=status.HTTP_201_CREATED
            )
        return Response(
            {"msg": "PicLogin Not Created"}, status=status.HTTP_400_BAD_REQUEST
        )

    def get(self, request, *args, **kwargs):
        queryset = PicLogin.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        if serializer.data:
            return Response(
                {"msg": "have a piclogin", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response({"msg": "no piclogin"}, status=status.HTTP_404_NOT_FOUND)


add_piclogin = AddPicsLogin.as_view()
