from django.contrib.auth import get_user_model
from rest_framework.serializers import CharField, ModelSerializer

User = get_user_model()


class UserLoginSerializer(ModelSerializer):
    username_email = CharField(
        style={"input_type": "text"}, min_length=5, max_length=50
    )

    class Meta:
        model = User
        fields = ["username_email", "password"]
