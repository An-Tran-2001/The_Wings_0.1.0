from django.shortcuts import render
from rest_framework.views import APIView
from .serializer import AddFriendSerializer, ListFriendSerializer, UserRequestFriendSerializer, UserBlockFriendSerializer
from rest_framework.response import Response
from rest_framework import status
from thewings_backend.users.renderers import UserRenderer
from .models import Friend
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from thewings_backend.custom_permission import IsAcessToken


class AddFriendView(APIView):
    serializer_class = AddFriendSerializer
    renderer_classes = (UserRenderer,)
    permission_classes = [IsAuthenticated & IsAcessToken]

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data, context={"user": request.user})
            if serializer.is_valid():
                serializer.save()
                return Response({"messenger": "send a friends request"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"messenger": 'This friend request has already been sent'}, status=status.HTTP_400_BAD_REQUEST)


class FriendView(APIView):
    serializer_class = ListFriendSerializer
    renderer_classes = (UserRenderer,)
    permission_classes = [IsAuthenticated & IsAcessToken]

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = self.serializer_class(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"messenger": "delete friend success"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserRequestFriendView(APIView):
    serializer_class = UserRequestFriendSerializer
    renderer_classes = (UserRenderer,)
    permission_classes = [IsAuthenticated & IsAcessToken]

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = self.serializer_class(request.user, data=request.data, partial=True)
        serializer.is_valid()
        serializer.save()
        return Response({"messenger": "success"}, status=status.HTTP_200_OK)


class UserBlockFriendView(APIView):
    serializer_class = UserBlockFriendSerializer
    renderer_classes = (UserRenderer,)
    permission_classes = [IsAuthenticated & IsAcessToken]

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = self.serializer_class(request.user, data=request.data, partial=True)
        serializer.is_valid()
        serializer.save()
        return Response({"messenger": "block success"}, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = self.serializer_class(request.user, data=request.data, partial=True)
        serializer.is_valid()
        serializer.save()
        return Response({"messenger": "delete block success"}, status=status.HTTP_200_OK)


friend_request_view = AddFriendView.as_view()
friend_view = FriendView.as_view()
user_request_friend_view = UserRequestFriendView.as_view()
user_block_friend_view = UserBlockFriendView.as_view()
