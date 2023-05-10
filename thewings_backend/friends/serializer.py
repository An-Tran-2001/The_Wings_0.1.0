from rest_framework import serializers
from .models import Friend, BlackFriend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()


class ViewFriendInfomationSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name", "avatar"]

    def get_avatar(self, obj):
        try:
            return obj.profile.avatar.url if obj.profile.avatar else None
        except:
            raise serializers.ValidationError("User not profile")


class FriendSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()

    class Meta:
        model = Friend
        fields = ["id", "friend", "is_accepted", "created_at"]
        read_only_fields = fields

    def get_friend(self, obj):
        return ViewFriendInfomationSerializer(obj.user).data


class AddFriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = ["friend"]

    def create(self, validated_data):
        if Friend.objects.filter(Q(user=self.context["user"]) & Q(friend=validated_data["friend"])).exists():
            raise serializers.ValidationError("You are already friends")
        if BlackFriend.objects.filter(Q(user=self.context["user"]) & Q(friend=validated_data["friend"])).exists():
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

    def get_friend(self, obj):
        query_user = obj.friends.filter(Q(user=obj.id) & Q(is_accepted=True)).values("friend")
        query_friend = obj.friend_requests.filter(Q(friend=obj.id) & Q(is_accepted=True)).values("user")
        query = User.objects.filter(Q(id__in=query_user) | Q(id__in=query_friend))
        return ViewFriendInfomationSerializer(query, many=True).data

    def update(self, instance, validated_data):
        friend_id = validated_data.pop("friend_id")
        friend = User.objects.get(id=friend_id)
        instance.friends.filter(friend=friend).delete()
        return instance


class UserRequestFriendSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()
    friend_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "name", "friend", "friend_id"]
        extra_kwargs = {"friend": {"read_only": True}, "name": {"read_only": True}}

    def get_friend(self, obj):
        query = obj.friend_requests.filter(Q(friend=obj.id) & Q(is_accepted=False))
        return FriendSerializer(query, many=True).data

    def update(self, instance, validated_data):
        friend_id = validated_data.pop("friend_id")
        friend = User.objects.get(id=friend_id)
        instance.friend_requests.filter(Q(user=friend) & Q(friend=instance)).update(is_accepted=True)
        return instance


class UserBlockFriendSerializer(serializers.ModelSerializer):
    list_black_friend = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = BlackFriend
        fields = ["black_friend", "list_black_friend"]
        kwargs = {"black_friend": {"read_only": True}, "list_black_friend": {"write_only": True}}
        
    def create(self, validated_data):
        return BlackFriend.objects.create(user=self.context["user"], **validated_data)
    
    def update(self, validated_data):
        return BlackFriend.objects.filter(user=self.context["user"], **validated_data).delete()
    
    def get_list_black_friend(self, obj):
        query = obj.black_friends.filter(user=obj.id)
        return ViewFriendInfomationSerializer(query, many=True).data