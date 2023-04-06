from rest_framework.views import APIView
from ..serializers import UserRegisterSerializer, SubmitCodeSerializer
from .variable import *
from rest_framework.response import Response
from rest_framework import status
from ..renderers import UserRenderer


class UserRegisterView(APIView):
    renderer_classes = (UserRenderer,)
    serializer_class = UserRegisterSerializer

    @email
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            return Response({'data': serializer.data, 'message': 'Send email success'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateRegisterView(APIView):
    renderer_classes = (UserRenderer,)
    serializer_class = SubmitCodeSerializer

    @code
    def post(self, request):
        print(request.data)
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data, 'message': 'Create user success'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


confirm_register_view = CreateRegisterView.as_view()
user_register_view = UserRegisterView.as_view()
