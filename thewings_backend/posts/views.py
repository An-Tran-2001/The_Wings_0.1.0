from django.shortcuts import render
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import IsAuthenticated
from ..users.custom_permission import IsAcessToken
from rest_framework.response import Response
from .serializers import PostsSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from .models import *
from thewings_backend.users.renderers import UserRenderer
from django.views.generic import DetailView
# Create your views here.


class PostsViewSet(RetrieveModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = PostsSerializer
    queryset = Post.objects.all()
    lookup_field = "id"
    permission_classes = [IsAuthenticated & IsAcessToken]
    renderer_classes = [UserRenderer]
    
    def get_queryset(self, *args, **kwargs):
        assert isinstance(self.request.user.id, int)
        if self.action == "my_post_all":
            return self.queryset.filter(author=self.request.user.id).order_by('-created_at')
        elif self.action == "retrieve":
            return self.queryset.filter(author=self.request.user.id)
        return self.queryset.filter(author=self.request.user.id)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        serializer.save()
    
    @action(detail=False)
    def my_post_all(self, request):
        serializer = PostsSerializer(
            self.queryset, many=True, context={"request": request}
        )
        return Response(status=status.HTTP_200_OK, data={"posts": serializer.data})
    
    @action(methods=["POST"], detail=False)
    def create_post(self, request):
        serializer = PostsSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)
        return Response(status=status.HTTP_201_CREATED, data={"message": "Post created successfully", "post": serializer.data})

