from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    birthday = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    sex = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["id", "username", "name", "email", "url", "avatar","bio", "birthday", "address", "cover_image", "sex"]

        extra_kwargs = {
            "url": {"view_name": "api:user-detail", "lookup_field": "username"}
        }

    def get_avatar(self, obj):
        try:
            return obj.profile.avatar.url if obj.profile.avatar else None
        except:
            return None
    def get_cover_image(self, obj):
        try:
            return obj.profile.cover_image.url if obj.profile.cover_image else None
        except:
            return None
    def get_birthday(self, obj):
        try:
            return obj.profile.birth_date if obj.profile.cover_image else None
        except:
            return None
    def get_address(self, obj):
        try:
            return obj.profile.adddress if obj.profile.address else None
        except:
            return None
    def get_sex(self, obj):
        try:
            return obj.profile.sex if obj.profile.sex else None
        except:
            return None
    def get_bio(self, obj):
        try:
            return obj.profile.bio if obj.profile.bio else None
        except:
            return None


class UserSerializerASGI(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["id", "username", "name", "avatar"]

    def get_avatar(self, obj):
        try:
            return obj.profile.avatar.url if obj.profile.avatar else None
        except:
            return None
