from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer, SerializerMethodField, HyperlinkedIdentityField, ValidationError, HyperlinkedModelSerializer
from .models import *
from thewings_backend.friends.models import Friend
from thewings_backend.users.api.serializers import UserSerializer

User = get_user_model()


class PostsSerializer(ModelSerializer):
    url = HyperlinkedIdentityField(view_name="posts:post-detail", lookup_field="id")
    comment = SerializerMethodField(read_only=True)
    like = SerializerMethodField(read_only=True)
    _tags = SerializerMethodField(read_only=True)
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = "__all__"
        extra_kwargs = {"author": {"read_only": True}, "comment": {"read_only": True}, "likes": {"read_only": True}, "tags": {"write_only": True}, "created_at": {"read_only": True}, "content" : {"required": True}}

    def get_comment(self, obj):
        try:     
            if obj.comment.count() > 2:
                return dict(total=obj.comment.count(), data=CommentSerializer(data=obj.comment.all()[:2], many=True, context=self.context).data)
        except:
            return dict(total=0, data=[])

    def get_like(self, obj):
        try:
            if obj.likes.count() > 2:
                return dict(total=obj.likes.count(), data=UserSerializer(obj.likes.filter(id__in=Friend.objects.filter(user=obj.user).values('friend'))[:2], many=True, context=self.context).data)
        except:
            return dict(total=0, data=[])

    def get__tags(self, obj):
        tags = obj.tags.all()
        return dict(total=tags.count(), data=UserSerializer(tags, many=True, context=self.context).data)
    
    def validate(self, attrs):
        if not attrs.get("content"):
            raise ValidationError("You can't post empty post")
        for id in attrs.get("tags"):
            print(id)
            if id == self.context.get("request").user:  
                raise ValidationError("You can't tag yourself")
            elif id in self.context.get("request").user.black_friends.values('black_friend'):
                raise ValidationError("You can't tag this user")
        return attrs
    
    def create(self, validated_data):
        tags = validated_data.pop("tags")
        post = Post.objects.create(**validated_data)
        if isinstance(tags, list):
            for tag in tags:
                post.tags.add(tag)
        return post


class CommentSerializer(ModelSerializer):
    user = SerializerMethodField()
    class Meta:
        model = Comment
        fields = "__all__"
        extra_kwargs = {"users": {"read_only": True}, "posts": {"read_only": True}}
        
    def get_user(self, obj):
        return UserSerializer(obj.users, context=self.context).data
