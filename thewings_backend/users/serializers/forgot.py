from rest_framework.serializers import ModelSerializer, ValidationError, CharField, EmailField
from django.contrib.auth import get_user_model


User = get_user_model()

class ResetPasswordSerializer(ModelSerializer):
    email = EmailField(max_length=255, min_length=3)
    password2 = CharField(style={'input_type': 'password'}, write_only=True)
    code = CharField(style={'input_type': 'password'}, max_length=6, min_length=6)

    class Meta:
        model = User
        fields = ['email','code','password', 'password2']
        extra_kwargs = {'password2': {'write_only': True}}

    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        if password != password2:
            raise ValidationError("Passwords must match.")
        return data

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()
        return instance
    
class SendMailForgotPasswordSerializer(ModelSerializer):
    email = EmailField(max_length=255, min_length=3)
    class Meta:
        model = User
        fields = ['email']
        extra_kwargs = {'email': {'write_only': True}}