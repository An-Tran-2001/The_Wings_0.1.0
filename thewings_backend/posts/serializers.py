from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer, SerializerMethodField, HyperlinkedIdentityField, ValidationError, HyperlinkedModelSerializer,PrimaryKeyRelatedField, IntegerField, IntegerField
from .models import *
from thewings_backend.friends.models import Friend
from thewings_backend.users.api.serializers import UserSerializer
from django.db.models import Q

User = get_user_model()


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
    user = SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = "__all__"
        extra_kwargs = {"users": {"read_only": True}, "posts": {"read_only": True}}
        
    def get_user(self, obj):
        return UserSerializer(obj.users, context=self.context).data

class CommentCreateSerializer(ModelSerializer):
    
    class Meta:
        model = Comment
        fields = "__all__"
        extra_kwargs = {"users": {"required": False}, "parent":  {"required": True}, "likes": {"read_only": True}}
    
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
        extra_kwargs = {"author": {"read_only": True}, "comments": {"read_only": True}, "likes": {"read_only": True}, "created_at": {"read_only": True}, "content" : {"required": True}}


class CreatePostSerializer(Posts):
    
    def validate(self, attrs):
        if not attrs.get("content"):
            raise ValidationError("You can't post empty post")
        for id in attrs.get("tags"):
            if id == self.context.get("request").user:  
                raise ValidationError("You can't tag yourself")
            elif id in self.context.get("request").user.black_friends.values('black_friend'):
                raise ValidationError("You can't tag this user")
        return attrs
    
    def create(self, validated_data):
        files = validated_data.pop("files", None) 
        tags = validated_data.pop("tags", None)
        post = Post.objects.create(**validated_data)
        if isinstance(tags, list):
            post.tags.add(*tags)
        if isinstance(files, list):
            post.post_files.add(*files)
        return post
    

class PostsSerializer(Posts):
    comments = SerializerMethodField(read_only=True)
    likes = SerializerMethodField(read_only=True)
    tags = SerializerMethodField()
    author = UserSerializer(read_only=True)
    files = SerializerMethodField()
    

    def get_comments(self, obj):
        user = self.context.get("request").user
        if friend:= Friend.objects.filter(Q(Q(user=user) | Q(friend=user) & Q(is_accepted=True))).values('user', 'friend'):
            comments_limit = obj.comments.filter(users__in = friend)[:2]
        comments_limit = obj.comments.all()[:2]
        return dict(total=obj.comments.count(), data=CommentSerializer(comments_limit, many=True, context=self.context).data)
    
    def get_likes(self, obj):
        user = self.context.get("request").user
        if friend:= Friend.objects.filter(Q(Q(user=user) | Q(friend=user) & Q(is_accepted=True))).values('user', 'friend'):
            like_limit = obj.likes.filter(users__in = friend)[:2]
        like_limit = obj.likes.all()[:2]
        return dict(total=obj.likes.count(), data=UserSerializer(like_limit, many=True, context=self.context).data)

    def get_tags(self, obj):
        tags = obj.tags.all()
        return dict(total=tags.count(), data=UserSerializer(tags, many=True, context=self.context).data)
    
    def get_files(self, obj):
        files = obj.post_files.all()
        return dict(total=files.count(), data=FileSerializer(files, many=True, context=self.context).data)

    





