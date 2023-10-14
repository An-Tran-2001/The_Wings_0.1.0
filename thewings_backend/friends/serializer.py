from rest_framework import serializers
from .models import Friend, BlackFriend
from django.contrib.auth import get_user_model
from django.db.models import Q
from thewings_backend.users.api.serializers import UserSerializer, OrtherUserSerializer
from drf_spectacular.utils import extend_schema_field

User = get_user_model()


class FriendSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()

    class Meta:
        model = Friend
        fields = ["id", "friend", "is_accepted", "created_at"]
        read_only_fields = fields

    @extend_schema_field(UserSerializer)
    def get_friend(self, obj):
        return OrtherUserSerializer(obj.user, context=self.context).data


class AddFriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = ["friend"]

    def validate(self, attrs):
        if attrs["friend"] == self.context["user"]:
            raise serializers.ValidationError("You can't add yourself")
        return attrs

    def create(self, validated_data):
        if Friend.objects.filter(
            Q(Q(user=self.context["user"]) | Q(friend=self.context["user"]))
            & Q(Q(user=validated_data["friend"]) | Q(friend=validated_data["friend"]))
            & Q(is_accepted=True)
        ).exists():
            raise serializers.ValidationError("You are already friends")
        if Friend.objects.filter(
            Q(Q(user=self.context["user"]) | Q(friend=self.context["user"]))
            & Q(Q(user=validated_data["friend"]) | Q(friend=validated_data["friend"]))
            & Q(is_accepted=False)
        ).exists():
            raise serializers.ValidationError("You are already sent request")
        if BlackFriend.objects.filter(
            Q(Q(user=self.context["user"]) | Q(black_friend=self.context["user"]))
            & Q(Q(user=validated_data["friend"]))
            | Q(black_friend=validated_data["friend"])
        ).exists():
            raise serializers.ValidationError("You are already blocked")
        if validated_data["friend"] == self.context["user"]:
            raise serializers.ValidationError("You can't add yourself")
        return Friend.objects.create(user=self.context["user"], **validated_data)


class ListFriendSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()
    friend_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "name", "friend", "friend_id"]
        extra_kwargs = {"friend": {"read_only": True}, "name": {"read_only": True}}

    def validate(self, attrs):
        if attrs["friend_id"] == self.context["request"].user.id:
            raise serializers.ValidationError("You can't remove yourself")
        return attrs

    @extend_schema_field(UserSerializer(many=True))
    def get_friend(self, obj):
        query_user = obj.friends.filter(Q(user=obj.id) & Q(is_accepted=True)).values(
            "friend"
        )
        query_friend = obj.friend_requests.filter(
            Q(friend=obj.id) & Q(is_accepted=True)
        ).values("user")
        query = User.objects.filter(Q(id__in=query_user) | Q(id__in=query_friend))
        return OrtherUserSerializer(query, many=True, context=self.context).data

    def update(self, instance, validated_data):
        friend_id = validated_data.pop("friend_id")
        return Friend.objects.filter(
            Q(Q(user=friend_id) | Q(friend=friend_id))
            & Q(Q(user=instance) | Q(friend=instance))
        ).delete()


class UserRequestFriendSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()
    friend_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "name", "friend", "friend_id"]
        extra_kwargs = {"friend": {"read_only": True}, "name": {"read_only": True}}

    def validate(self, attrs):
        if attrs["friend_id"] == self.context["request"].user.id:
            raise serializers.ValidationError("You can't add yourself")
        return attrs

    @extend_schema_field(FriendSerializer(many=True))
    def get_friend(self, obj):
        query = obj.friend_requests.filter(Q(friend=obj.id) & Q(is_accepted=False))
        return FriendSerializer(query, many=True, context=self.context).data

    def update(self, instance, validated_data):
        friend_id = validated_data.pop("friend_id")
        instance.friend_requests.filter(Q(user=friend_id) & Q(friend=instance)).update(
            is_accepted=True
        )
        return instance


class UserBlockFriendSerializer(serializers.ModelSerializer):
    black_friend = serializers.SerializerMethodField()

    class Meta:
        model = BlackFriend
        fields = ["black_friend"]

    def validate(self, attrs):
        if attrs["black_friend"] == self.context["request"].user.id:
            raise serializers.ValidationError("You can't add yourself")
        return attrs

    @extend_schema_field(OrtherUserSerializer(many=True))
    def get_black_friend(self, obj):
        query = User.objects.filter(
            id__in=obj.black_friends.all().values("black_friend")
        )
        return OrtherUserSerializer(query, many=True, context=self.context).data


class BlockUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlackFriend
        fields = ["black_friend"]

    def validate(self, attrs):
        if attrs["black_friend"] == self.context["request"].user.id:
            raise serializers.ValidationError("You can't add yourself")
        return attrs

    def create(self, validated_data):
        other_user = validated_data.get("black_friend", None)
        user = self.context["request"].user
        if Friend.objects.filter(
            Q(Q(user=user) | Q(friend=user))
            & Q(Q(user=other_user) | Q(friend=other_user))
        ).exists():
            friend_rl = Friend.objects.filter(
                Q(Q(user=user) | Q(friend=user))
                & Q(Q(user=other_user) | Q(friend=other_user))
            ).first()
            friend_rl.delete()
        return BlackFriend.objects.create(
            user=self.context["request"].user, **validated_data
        )
