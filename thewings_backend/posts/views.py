from django.shortcuts import render
from django.contrib.auth import get_user_model
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
from thewings_backend.posts.models import Post, Comment
from thewings_backend.users.renderers import UserRenderer
from django.views.generic import DetailView
from django.db.models import Q
from thewings_backend.docs.posts import get_all_post_docs
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from thewings_backend.friends.models import Friend
from thewings_backend.paginate import StandardResultsSetPagination
from rest_framework.pagination import PageNumberPagination


User = get_user_model()

# Create your views here.

class PostsViewSet(RetrieveModelMixin, ListModelMixin, GenericViewSet):
    serializer_class = PostsSerializer
    queryset = Post.objects.all()
    lookup_field = "id"
    permission_classes = [IsAuthenticated & IsAcessToken]
    renderer_classes = [UserRenderer]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self, *args, **kwargs):
        assert isinstance(self.request.user.id, int)
        if self.action == "my_post_all":
            return self.queryset.filter(Q(author=self.request.user.id) | Q(tags=self.request.user)).order_by("-created_at")
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

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='page',
                type=int,
                description='Page number',
                required=False,
            ),
            OpenApiParameter(
                name='page_size',
                type=int,
                description='Number of results per page',
                required=False,
            ),
        ],
        responses=OpenApiResponse(response=PostsSerializer),
    )
    @get_all_post_docs()
    @action(detail=False, pagination_class=StandardResultsSetPagination, methods=["get"])
    def my_post_all(self, request):
        post = self.get_queryset()
        page = self.paginate_queryset(post)
        if page is not None:
            serializer = self.serializer_class(
                page,
                many=True,
                context={"request": request},
            )
            return self.get_paginated_response(serializer.data)
        serializer = self.serializer_class(
            post, many=True, context={"request": request}
        )
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='page',
                type=int,
                description='Page number',
                required=False,
            ),
            OpenApiParameter(
                name='page_size',
                type=int,
                description='Number of results per page',
                required=False,
            ),
        ],
        responses=OpenApiResponse(response=PostsSerializer),
    )
    @action(detail=False, methods=["get"], url_path="(?P<username>[^/.]+)", pagination_class=StandardResultsSetPagination)
    def your_post(self, request, *args, **kwargs):
        username = kwargs.get("username", None)
        if not User.objects.filter(username=username).exists():
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"message": "User not found"}
            )
        ot_user = User.objects.get(username=username)
        post = Post.objects.get_yourposts(request.user, ot_user)
        page = self.paginate_queryset(post)
        if page is not None:
            serializer = self.serializer_class(
                page,
                many=True,
                context={"request": request},
            )
            return self.get_paginated_response(serializer.data)
        serializer = self.serializer_class(
            post,
            many=True,
            context={"request": request},
        )
        return Response(status=status.HTTP_200_OK, data=serializer.data)
    
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='page',
                type=int,
                description='Page number',
                required=False,
            ),
            OpenApiParameter(
                name='page_size',
                type=int,
                description='Number of results per page',
                required=False,
            ),
        ],
        responses=OpenApiResponse(response=PostsSerializer),
    )
    @action(detail=False, methods=["get"], pagination_class=StandardResultsSetPagination)
    def all(self, request, *args, **kwargs):
        friends = Friend.objects.filter(Q(Q(user=self.request.user) | Q(friend=self.request.user)) & Q(is_accepted=True)).values("user", "friend")
        friend_ids = set(friend['user'] for friend in friends) | set(friend['friend'] for friend in friends)
        post = Post.objects.filter(
            Q(Q(author=self.request.user.id) | Q(author__in=friend_ids)) &
            Q(status__in=["public", "private"])
        )
        page = self.paginate_queryset(post)
        if page is not None:
            serializer = self.serializer_class(
                page,
                many=True,
                context={"request": request},
            )
            return self.get_paginated_response(serializer.data)
        
        serializer = self.serializer_class(
                post,
                many=True,
                context={"request": request},
            )
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(detail=True, methods=['delete'])
    def delete_post(self, request, *args, **kwargs):
        instance = Post.objects.get(id=kwargs.get("id", None))
        if instance.author == request.user:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN, data={"message": "You don't have permission to delete this post"})

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
        
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data = {"message": "Post updated successfully", "post": response.data}
        return response

    def partial_update(self, request, *args, **kwargs):
        response = super().partial_update(request, *args, **kwargs)
        post = Post.objects.get(id=kwargs.get("id", None))
        response.data = PostsSerializer(post, context={"request": request}).data
        return response
    @action(detail=False, methods=["post"])
    def creat(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)
        post = Post.objects.get(id=serializer.data["id"])
        return Response(
            status=status.HTTP_201_CREATED,
            data={"message": "Post created successfully", "post": PostsSerializer(post, context={"request": request}).data},
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
        post_id = serializer.data["post"]
        comment_id = serializer.data["comment"]
        if post_id and not comment_id:
            post = Post.objects.get(id=post_id)
        else:
            post = Comment.objects.get(id=comment_id).posts
        
        print(post)
        return Response(
            status=status.HTTP_201_CREATED,
            data={"post": PostsSerializer(post, context={"request": request}).data}
        )


class CommentViewSet(APIView):
    permission_classes = [IsAuthenticated & IsAcessToken & PostStatus]
    renderer_classes = [UserRenderer]
    serializer_class = CommentCreateSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    lookup_field = 'id'

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(users=request.user)
        post = Post.objects.get(id=request.data["posts"])
        return Response(
            status=status.HTTP_201_CREATED,
            data={"post": PostsSerializer(post, context={"request": request}).data}
        )
        
class CommentDetailViewSet(APIView):
    permission_classes = [IsAuthenticated & IsAcessToken & IsAuthor]
    renderer_classes = [UserRenderer]
    serializer_class = CommentSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    lookup_field = 'id'
    def delete(self, request, *args, **kwargs):
        instance = Comment.objects.get(id=kwargs.get("id", None))
        if instance.users == request.user:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN, data={"message": "You don't have permission to delete this comment"})
