from django.shortcuts import render
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from thewings_backend.custom_permission import IsAcessToken, PermissionPosts
from rest_framework.response import Response
from .serializers import PostsSerializer, CreatePostSerializer, CommentCreateSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from .models import *
from thewings_backend.users.renderers import UserRenderer
from django.views.generic import DetailView
# Create your views here.


class PostsViewSet(RetrieveModelMixin, ListModelMixin, GenericViewSet):
    serializer_class = PostsSerializer
    queryset = Post.objects.all()
    lookup_field = "id"
    permission_classes = [IsAuthenticated & IsAcessToken & PermissionPosts]
    renderer_classes = [UserRenderer]
    
    def get_queryset(self, *args, **kwargs):
        assert isinstance(self.request.user.id, int)
        if self.action == "my_post_all":
            return self.queryset.filter(author=self.request.user.id).order_by('-created_at')
        elif self.action == "retrieve":
            return self.queryset.filter(author=self.request.user.id)
        return self.queryset.filter(author=self.request.user.id)
    
    
    @action(detail=False)
    def my_post_all(self, request):
        serializer = PostsSerializer(
            self.queryset, many=True, context={"request": request}
        )
        return Response(status=status.HTTP_200_OK, data={"posts": serializer.data})
    

class CreatePostViewSet(UpdateModelMixin, GenericViewSet):
    serializer_class = CreatePostSerializer
    queryset = Post.objects.all()
    lookup_field = "id"
    permission_classes = [IsAuthenticated & IsAcessToken & PermissionPosts]
    renderer_classes = [UserRenderer]
    parser_classes = (MultiPartParser, FormParser)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=False, methods=['post'])
    def creat(self, request, *args, **kwargs):
        serializer = CreatePostSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)
        return Response(status=status.HTTP_201_CREATED, data={"message": "Post created successfully", "post": serializer.data})


class LikePostView(APIView):
    permission_classes = [IsAuthenticated & IsAcessToken & PermissionPosts]
    renderer_classes = [UserRenderer]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, post_id, *args, **kwargs):
        post = Post.objects.get(id=post_id)
        if post.likes.filter(id=request.user.id).exists():
            post.likes.remove(request.user)
            return Response(status=status.HTTP_200_OK, data={"message": "Like removed successfully"})
        else:
            post.likes.add(request.user)
            return Response(status=status.HTTP_200_OK, data={"message": "Like added successfully"})
    
class LikeCommentView(APIView):
    permission_classes = [IsAuthenticated & IsAcessToken & PermissionPosts]
    renderer_classes = [UserRenderer]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, comment_id, *args, **kwargs):
        comment = Comment.objects.get(id=comment_id)
        if comment.likes.filter(id=request.user.id).exists():
            comment.likes.remove(request.user)
            return Response(status=status.HTTP_200_OK, data={"message": "Like removed successfully"})
        else:
            comment.likes.add(request.user)
            return Response(status=status.HTTP_200_OK, data={"message": "Like added successfully"})

    
    
    
class CommentViewSet(APIView):
    permission_classes = [IsAuthenticated & IsAcessToken]
    renderer_classes = [UserRenderer]
    serializer_class = CommentCreateSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        serializer = CommentCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(users=request.user)
        return Response(status=status.HTTP_201_CREATED, data={"message": "Comment created successfully", "post": serializer.data})