from django.contrib.auth import get_user_model
from rest_framework.serializers import ImageField, ModelSerializer, ValidationError

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
