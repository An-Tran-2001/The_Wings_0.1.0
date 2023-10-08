from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from thewings_backend.friends.models import Friend
from thewings_backend.users.api.serializers import OrtherUserSerializer
from django.contrib.auth import get_user_model
from thewings_backend.custom_permission import IsAcessToken
from thewings_backend.users.renderers import UserRenderer
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .serializer import (
    AddFriendSerializer,
    BlockUserSerializer,
    ListFriendSerializer,
    UserBlockFriendSerializer,
    UserRequestFriendSerializer,
)

User = get_user_model()

class AddFriendView(APIView):
    serializer_class = AddFriendSerializer
    renderer_classes = (UserRenderer,)
    permission_classes = [IsAuthenticated & IsAcessToken]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"user": request.user}
        )
        if serializer.is_valid():
            serializer.save()
            orther_user = get_object_or_404(User, id=serializer.data["friend"])
            return Response(
                OrtherUserSerializer(orther_user, context={"request": request}).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FriendView(APIView):
    serializer_class = ListFriendSerializer
    renderer_classes = (UserRenderer,)
    permission_classes = [IsAuthenticated & IsAcessToken]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request):
        serializer = self.serializer_class(request.user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = self.serializer_class(
            request.user, data=request.data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"messenger": "delete friend success"}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserRequestFriendView(APIView):
    serializer_class = UserRequestFriendSerializer
    renderer_classes = (UserRenderer,)
    permission_classes = [IsAuthenticated & IsAcessToken]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request):
        serializer = self.serializer_class(request.user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = self.serializer_class(
            request.user, data=request.data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            other_user = get_object_or_404(User, id=request.data["friend_id"])
            return Response(OrtherUserSerializer(other_user, context={"request": request}).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class DeleteFriendView(APIView):
    def delete(self, request, username):
        orther_user = get_object_or_404(User, username=username)
        item = Friend.objects.filter(Q(user=request.user.id, friend=orther_user.id) | Q(user=orther_user.id, friend=request.user.id)).first()
        if item:
            item.delete()
            return Response(OrtherUserSerializer(orther_user, context={"request": request}).data, status=status.HTTP_200_OK)
        return Response({"messenger": "fail"}, status=status.HTTP_400_BAD_REQUEST)


class UserBlockFriendView(APIView):
    serializer_class = UserBlockFriendSerializer
    renderer_classes = (UserRenderer,)
    permission_classes = [IsAuthenticated & IsAcessToken]

    def get(self, request):
        serializer = self.serializer_class(request.user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class BlockFriendView(APIView):
    serializer_class = BlockUserSerializer
    renderer_classes = (UserRenderer,)
    permission_classes = [IsAuthenticated & IsAcessToken]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"messenger": "success"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteBlockView(APIView):
    renderer_classes = (UserRenderer,)
    permission_classes = [IsAuthenticated & IsAcessToken]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def delete(self, request, id):
        request.user.black_friends.filter(user=request.user, black_friend=id).delete()
        return Response({"messenger": "success"}, status=status.HTTP_200_OK)


friend_request_view = AddFriendView.as_view()
friend_view = FriendView.as_view()
user_request_friend_view = UserRequestFriendView.as_view()
user_block_friend_view = UserBlockFriendView.as_view()
block_friend_view = BlockFriendView.as_view()
unblock_friend_view = DeleteBlockView.as_view()
delete_friend_vew = DeleteFriendView.as_view()
