from django.contrib.auth import get_user_model
from rest_framework.serializers import ImageField, ModelSerializer, ValidationError, CharField

from thewings_backend.users.models.profile import Profile

User = get_user_model()


class UserProfileSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "user_name", "email", "name", "phone_number"]
        read_only_fields = fields


class UserCreateProfileSerializer(ModelSerializer):
    avatar = ImageField(
        max_length=None, use_url=True, required=False, allow_empty_file=True
    )
    cover_image = ImageField(
        max_length=None, use_url=True, required=False, allow_empty_file=True
    )

    class Meta:
        model = Profile
        fields = ["bio", "sex", "birth_date", "address", "avatar", "cover_image"]

    def validate(self, data):
        user = self.context["user"]
        if Profile.objects.filter(user=user).exists():
            raise ValidationError("You have already created a profile")
        return data

    def create(self, validated_data):
        user = self.context["user"]
        profile = Profile.objects.create(user=user, **validated_data)
        return profile

class UserUpdateProfile(ModelSerializer):
    avatar = ImageField(
        max_length=None, use_url=True, required=False, allow_empty_file=True
    )
    cover_image = ImageField(
        max_length=None, use_url=True, required=False, allow_empty_file=True
    )
    sex = CharField(required=False)
    birth_date = CharField(required=False)
    class Meta:
        model = Profile
        fields = ["bio", "sex", "birth_date", "address", "avatar", "cover_image"]
        read_only_fields = fields
        extra_kwargs = {
                "avatar": {"required": False, "allow_empty_file": True},
                "cover_image": {"required": False, "allow_empty_file": True},
        }
    def update(self, instance, validated_data):
        instance.bio = validated_data.get("bio", instance.bio)
        instance.sex = validated_data.get("sex", instance.sex)
        instance.birth_date = validated_data.get("birth_date", instance.birth_date)
        instance.address = validated_data.get("address", instance.address)
        instance.avatar = validated_data.get("avatar", instance.avatar)
        instance.cover_image = validated_data.get("cover_image", instance.cover_image)
        instance.save()
        return instance