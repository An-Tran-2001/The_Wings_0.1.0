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
)
from .models import *
from thewings_backend.friends.models import Friend
from thewings_backend.users.api.serializers import UserSerializer
from django.db.models import Q
from drf_spectacular.utils import extend_schema_field

User = get_user_model()


class LikeSerializer(ModelSerializer):
    class Meta:
        model = Like
        fields = "__all__"
        extra_kwargs = {
            "user": {"read_only": True, "required": False},
            "posts": {"required": False},
            "comments": {"required": False},
        }

    def create(self, validated_data):
        if Like.objects.filter(
            Q(user=validated_data.get("user"))
            & Q(
                Q(post=validated_data.get("post"))
                | Q(comment=validated_data.get("comment"))
            )
        ).exists():
            raise ValidationError("You already liked this post")
        return Like.objects.create(**validated_data)

    def update(self, instance, validated_data):
        if instance := Like.objects.filter(
            Q(user=validated_data.get("user"))
            & Q(
                Q(post=validated_data.get("post"))
                | Q(comment=validated_data.get("comment"))
            )
        ).first():
            print(instance)
            instance.status = validated_data.get("status", instance.status)
            if instance.status == "dislike":
                instance.delete()
            else:
                instance.save()
            return instance
        raise ValidationError("Empty Post or Comment")


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
    class Meta:
        model = File
        fields = "__all__"
        extra_kwargs = {"post": {"write_only": True}}


class Comments(ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"


class CommentSerializer(ModelSerializer):
    users = SerializerMethodField()
    likes = SerializerMethodField()

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
    files = FileSerializer(many=True, required=False)

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
            for id in attrs.get("tags"):
                if id == self.context.get("request").user:
                    raise ValidationError("You can't tag yourself")
                elif id in self.context.get("request").user.black_friends.values(
                    "black_friend"
                ):
                    raise ValidationError("You can't tag this user")
        return attrs

    def create(self, validated_data):
        if not validated_data.get("content"):
            raise ValidationError("You can't post empty post")
        files = validated_data.pop("files", None)
        tags = validated_data.pop("tags", None)
        post = Post.objects.create(**validated_data)
        if isinstance(tags, list):
            post.tags.add(*tags)
        if isinstance(files, list):
            post.post_files.add(*files)
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
        user = self.context.get("request").user
        if friend := Friend.objects.filter(
            Q(Q(user=user) | Q(friend=user) & Q(is_accepted=True))
        ).values("user", "friend"):
            comments_limit = obj.post_comments.filter(users__in=friend)[:2]
        comments_limit = obj.post_comments.all()[:2]
        return dict(
            count=obj.comments.count(),
            recomment=CommentSerializer(
                comments_limit, many=True, context=self.context
            ).data,
            data=CommentSerializer(
                obj.post_comments.all(), many=True, context=self.context
            ).data,
        )

    @extend_schema_field(DocsLikesSerializer)
    def get_likes(self, obj):
        user = self.context.get("request").user
        if friend := Friend.objects.filter(
            Q(Q(user=user) | Q(friend=user) & Q(is_accepted=True))
        ).values("user", "friend"):
            like_limit = obj.likes.filter(users__in=friend)[:2]
        like_limit = obj.post_likes.all()[:2]
        return dict(
            count=obj.likes.count(),
            recomment=GetPostLikeSerializer(
                like_limit, many=True, context=self.context
            ).data,
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
