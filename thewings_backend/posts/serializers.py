from django.contrib.auth import get_user_model
from rest_framework.serializers import (
    ModelSerializer,
    SerializerMethodField,
    HyperlinkedIdentityField,
    ValidationError,
    HyperlinkedModelSerializer,
    PrimaryKeyRelatedField,
    IntegerField,
    IntegerField,
    ImageField,
    ListField,
    CharField,
)
from .models import *
from thewings_backend.friends.models import Friend
from thewings_backend.users.api.serializers import UserSerializer
from django.db.models import Q
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

User = get_user_model()


class LikeSerializer(ModelSerializer):
    class Meta:
        model = Like
        fields = "__all__"
        extra_kwargs = {
            "user": {"read_only": True, "required": False},
            "post": {"required": False},
            "comment": {"required": False},
        }

    def create(self, validated_data):
        user = validated_data.get("user")
        post = validated_data.get("post")
        comment = validated_data.get("comment")
        status = validated_data.get("status")
        if not post: 
            existing_like_comment = Like.objects.filter(user=user, post__isnull=True, comment=comment).first()
            if existing_like_comment:
                if status == "dislike":
                    existing_like_comment.delete()
                    return existing_like_comment
                existing_like_comment.status = status
                existing_like_comment.save()
                return existing_like_comment
        if not comment:
            existing_like_post = Like.objects.filter(user=user, post=post, comment__isnull=True).first()
            if existing_like_post:
                if status == "dislike":
                    existing_like_post.delete()
                    return existing_like_post
                existing_like_post.status = status
                existing_like_post.save()
                return existing_like_post
            
        existing_like_comment = Like.objects.filter(user=user, post=post, comment=comment).first()
        if existing_like_comment:
            if status == "dislike":
                existing_like_comment.delete()
                return existing_like_comment
            existing_like_comment.status = status
            existing_like_comment.save()
            return existing_like_comment

        new_like = Like.objects.create(**validated_data)
        return new_like


class LikeCreateSerializer(LikeSerializer):
    def create(self, validated_data):
        like = Like.objects.create(**validated_data)
        return like


class GetPostLikeSerializer(ModelSerializer):
    user = SerializerMethodField()

    class Meta:
        model = Like
        fields = ["id", "user", "status", "created_at", "updated_at"]

    @extend_schema_field(UserSerializer)
    def get_user(self, obj):
        return UserSerializer(obj.user, context=self.context).data


class DocsLikesSerializer(ModelSerializer):
    count = IntegerField()
    recomment = GetPostLikeSerializer(many=True)
    data = GetPostLikeSerializer(many=True)

    class Meta:
        model = Like
        fields = ["count", "recomment", "data"]


class DocLikesSerializer(DocsLikesSerializer):
    class Meta:
        model = Like
        fields = ["count", "data"]


class FileSerializer(ModelSerializer):
    file = ImageField(
        max_length=None, use_url=True, required=False, allow_empty_file=True
    )
    class Meta:
        model = File
        fields = ["file", "name"]
        extra_kwargs = {"post": {"write_only": True}}


class Comments(ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"


class CommentSerializer(ModelSerializer):
    users = SerializerMethodField()
    likes = SerializerMethodField()
    parent = SerializerMethodField()
    class Meta:
        model = Comment
        fields = "__all__"
        extra_kwargs = {"users": {"read_only": True}, "posts": {"read_only": True}}

    @extend_schema_field(UserSerializer)
    def get_users(self, obj):
        return UserSerializer(obj.users, context=self.context).data

    @extend_schema_field(DocLikesSerializer)
    def get_likes(self, obj):
        return dict(
            count=obj.likes.count(),    
            data=GetPostLikeSerializer(
                obj.comment_likes.all(), many=True, context=self.context
            ).data,
        )
    def get_parent(self, obj):
        return CommentSerializer(obj.parent_comments.all(), context=self.context, many=True).data


class DocsCommentSerializer(ModelSerializer):
    count = IntegerField()
    recomment = CommentSerializer(many=True)
    data = CommentSerializer(many=True)

    class Meta:
        model = Comment
        fields = ["count", "recomment", "data"]


class CommentCreateSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"
        extra_kwargs = {
            "users": {"required": False, "read_only": True},
            "parent": {"required": False},
            "likes": {"read_only": True},
        }

    def validate(self, attrs):
        if not attrs.get("content"):
            raise ValidationError("You can't post empty comment")
        return attrs

    def create(self, validated_data):
        comment = Comment.objects.create(**validated_data)
        return comment


class Posts(ModelSerializer):
    url = HyperlinkedIdentityField(view_name="posts:post-detail", lookup_field="id")
    files = serializers.ListField(child=serializers.ImageField(max_length=None, use_url=True, required=False, allow_empty_file=True), required=False)
    tags = serializers.ListField(child=PrimaryKeyRelatedField(queryset=User.objects.all()), required=False, write_only=True)

    class Meta:
        model = Post
        fields = "__all__"
        extra_kwargs = {
            "author": {"read_only": True},
            "comments": {"read_only": True},
            "likes": {"read_only": True},
            "created_at": {"read_only": True},
            "content": {"required": True},
        }


class CreatePostSerializer(Posts):
    def validate(self, attrs):
        if attrs.get("tags"):
            current_user = self.context.get("request").user
            black_friends = current_user.black_friends.values_list("black_friend", flat=True)
            for tag in attrs.get("tags"):
                if tag == current_user:
                    raise ValidationError("You can't tag yourself")
                elif tag.id in black_friends:
                    raise ValidationError("You can't tag this user")
        return attrs

    def create(self, validated_data):
        if not validated_data.get("content"):
            raise ValidationError("You can't post an empty post")
        files = validated_data.pop("files", None)
        tags = validated_data.pop("tags", None)
        post = Post.objects.create(**validated_data)
        if isinstance(tags, list):
            tagsId = [tag.id for tag in tags]
            post.tags.add(*tagsId)
        if files:
            for file in files:
                File.objects.create(post=post, file=file).save()
        return post


class DocsTagsSerializer(ModelSerializer):
    count = IntegerField()
    data = UserSerializer(many=True)

    class Meta:
        model = Post
        fields = ["count", "data"]


class DocsFilesSerializer(DocsTagsSerializer):
    data = FileSerializer(many=True)


class PostsSerializer(Posts):
    comments = SerializerMethodField(read_only=True)
    likes = SerializerMethodField(read_only=True)
    tags = SerializerMethodField()
    author = UserSerializer(read_only=True)
    files = SerializerMethodField()

    @extend_schema_field(DocsCommentSerializer)
    def get_comments(self, obj):
        return dict(
            count=obj.comments.count(),
            data=CommentSerializer(
                obj.post_comments.all(), many=True, context=self.context
            ).data,
        )

    @extend_schema_field(DocsLikesSerializer)
    def get_likes(self, obj):
        return dict(
            count=obj.likes.count(),
            data=GetPostLikeSerializer(
                obj.post_likes.all(), many=True, context=self.context
            ).data,
        )

    @extend_schema_field(DocsTagsSerializer)
    def get_tags(self, obj):
        tags = obj.tags.all()
        return dict(
            count=tags.count(),
            data=UserSerializer(tags, many=True, context=self.context).data,
        )

    @extend_schema_field(DocsFilesSerializer)
    def get_files(self, obj):
        files = obj.post_files.all()
        return dict(
            count=files.count(),
            data=FileSerializer(files, many=True, context=self.context).data,
        )
