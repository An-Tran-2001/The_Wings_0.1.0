from rest_framework.views import APIView
from ..serializers.add_piclogin import AddPicsLoginSerializer
from ..renderers import UserRenderer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
import base64
from ..models import PicLogin
from ..tasks import save_image_login
class AddPicsLogin(APIView):
    renderer_classes = (UserRenderer,)
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = AddPicsLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            save_image_login.delay(serializer.data)
            return Response({'msg': 'PicLogin Successfully Created'}, status=status.HTTP_201_CREATED)
        return Response({'msg': 'PicLogin Not Created'}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        queryset = PicLogin.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        if serializer.data:
            return Response({'msg': 'have a piclogin', 'data': serializer.data}, status=status.HTTP_200_OK)
        return Response({'msg': 'no piclogin'}, status=status.HTTP_404_NOT_FOUND)


add_piclogin = AddPicsLogin.as_view()
