from django.shortcuts import render
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from thewings_backend.custom_permission import IsAcessToken, PermissionPosts
from rest_framework.response import Response
from .serializers import PostsSerializer, CreatePostSerializer, CommentCreateSerializer, LikeSerializer, CommentSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from .models import *
from thewings_backend.users.renderers import UserRenderer
from django.views.generic import DetailView
from django.db.models import Q
from thewings_backend.docs.posts import get_post_docs
from drf_spectacular.utils import extend_schema
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
    
    @get_post_docs()
    @action(detail=False)
    def my_post_all(self, request):
        serializer = self.serializer_class(
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
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)
        return Response(status=status.HTTP_201_CREATED, data={"message": "Post created successfully", "post": serializer.data})


class LikeViewSet(APIView):
    permission_classes = [IsAuthenticated & IsAcessToken & PermissionPosts]
    renderer_classes = [UserRenderer]
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = LikeSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(status=status.HTTP_201_CREATED, data={"message": "Like created successfully", "post": serializer.data})

    def patch(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=request.data, data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(status=status.HTTP_201_CREATED, data={"message": "Like change successfully", "post": serializer.data})
    
    
class CommentViewSet(APIView):
    permission_classes = [IsAuthenticated & IsAcessToken]
    renderer_classes = [UserRenderer]
    serializer_class = CommentCreateSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(users=request.user)
        return Response(status=status.HTTP_201_CREATED, data={"message": "Comment created successfully", "post": serializer.data})