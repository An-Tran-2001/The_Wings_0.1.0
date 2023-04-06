from rest_framework.serializers import ModelSerializer, ValidationError, CharField
from django.contrib.auth import get_user_model


User = get_user_model()


class UserRegisterSerializer(ModelSerializer):
    password2 = CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'phone_number', 'name', 'tc', 'password', 'password2']
        extra_kwargs = {'password2': {'write_only': True}}

    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        if password != password2:
            raise ValidationError("Passwords must match.")
        return data

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class SubmitCodeSerializer(ModelSerializer):
    code = CharField(style={'input_type': 'password'}, write_only=True, max_length=6, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'code']
