from django.shortcuts import render
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from thewings_backend.custom_permission import IsAcessToken, IsAuthor, PostStatus
from rest_framework.response import Response
from .serializers import (
    PostsSerializer,
    CreatePostSerializer,
    CommentCreateSerializer,
    LikeSerializer,
    CommentSerializer,
)
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import *
from thewings_backend.users.renderers import UserRenderer
from django.views.generic import DetailView
from django.db.models import Q
from thewings_backend.docs.posts import get_all_post_docs
from drf_spectacular.utils import extend_schema
from thewings_backend.friends.models import Friend

# Create your views here.


class PostsViewSet(RetrieveModelMixin, ListModelMixin, GenericViewSet):
    serializer_class = PostsSerializer
    queryset = Post.objects.all()
    lookup_field = "id"
    permission_classes = [IsAuthenticated & IsAcessToken]
    renderer_classes = [UserRenderer]

    def get_queryset(self, *args, **kwargs):
        assert isinstance(self.request.user.id, int)
        if self.action == "my_post_all":
            return self.queryset.filter(author=self.request.user.id).order_by(
                "-created_at"
            )
        if friend := Friend.objects.filter(
            Q(
                Q(user=self.request.user)
                | Q(friend=self.request.user) & Q(is_accepted=True)
            )
        ).values("user", "friend"):
            return self.queryset.filter(
                Q(author=self.request.user.id) | Q(author__in=friend)
            ).order_by("-created_at")

        return self.queryset.filter(status="public").order_by("-created_at")

    def retrieve(self, request, *args, **kwargs):
        post_id = kwargs.get("id", None)
        status_post = (
            self.queryset.filter(id=post_id).values("status").first()["status"]
        )
        if status_post == "private":
            if friend := Friend.objects.filter(
                Q(
                    Q(user=self.request.user)
                    | Q(friend=self.request.user) & Q(is_accepted=True)
                )
            ).values("user", "friend"):
                if (
                    self.queryset.filter(
                        Q(author=self.request.user.id) | Q(author__in=friend)
                    )
                    .filter(id=post_id)
                    .exists()
                ):
                    return super().retrieve(request, *args, **kwargs)
            else:
                return Response(
                    status=status.HTTP_403_FORBIDDEN,
                    data={"message": "You guys are not friends"},
                )
        elif status_post == "private_only":
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"message": "Only author can see this post"},
            )
        return super().retrieve(request, *args)

    @get_all_post_docs()
    @action(detail=False)
    def my_post_all(self, request):
        serializer = self.serializer_class(
            self.get_queryset(), many=True, context={"request": request}
        )
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(detail=False, methods=["get"], url_path="(?P<username>[^/.]+)")
    def your_post(self, request, *args, **kwargs):
        user_id = kwargs.get("username", None)
        if not User.objects.filter(username=user_id).exists():
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"message": "User not found"}
            )
        user_id = User.objects.get(username=user_id).id
        friend = Friend.objects.filter(
            Q(Q(user=user_id) | Q(friend=user_id) & Q(is_accepted=True))
        ).values("user", "friend")
        if self.request.user.id in friend:
            serializer = self.serializer_class(
                self.get_queryset().filter(Q(author=user_id) | Q(status="private")),
                many=True,
                context={"request": request},
            )
        else:
            serializer = self.serializer_class(
                Post.objects.filter(author=user_id, status="public"),
                many=True,
                context={"request": request},
            )
        return Response(status=status.HTTP_200_OK, data=serializer.data)
    
    @action(detail=False, methods=["get"])
    def all(self, request, *args, **kwargs):
        serializer = self.serializer_class(
                Post.objects.filter(status="public"),
                many=True,
                context={"request": request},
            )
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class CreatePostViewSet(UpdateModelMixin, GenericViewSet):
    serializer_class = CreatePostSerializer
    queryset = Post.objects.all()
    lookup_field = "id"
    permission_classes = [IsAuthenticated & IsAcessToken & IsAuthor]
    renderer_classes = [UserRenderer]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def perform_create(self, serializer, *args, **kwargs):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer, *args, **kwargs):
        serializer.save(author=self.request.user)

    @action(detail=False, methods=["post"])
    def creat(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)
        return Response(
            status=status.HTTP_201_CREATED,
            data={"message": "Post created successfully", "post": serializer.data},
        )


class LikeViewSet(APIView):
    permission_classes = [IsAuthenticated & IsAcessToken]
    renderer_classes = [UserRenderer]
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    serializer_class = LikeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        post = Post.objects.get(id=serializer.data["post"])
        return Response(
            status=status.HTTP_201_CREATED,
            data={"post": PostsSerializer(post, context={"request": request}).data}
        )


class CommentViewSet(APIView):
    permission_classes = [IsAuthenticated & IsAcessToken & PostStatus]
    renderer_classes = [UserRenderer]
    serializer_class = CommentCreateSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(users=request.user)
        return Response(
            status=status.HTTP_201_CREATED,
            data={"message": "Comment created successfully", "post": serializer.data},
        )
