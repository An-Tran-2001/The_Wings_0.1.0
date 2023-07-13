from rest_framework.serializers import FileField, ModelSerializer

from thewings_backend.users.models import PicLogin


class AddPicsLoginSerializer(ModelSerializer):
    background_image = FileField(
        max_length=None, use_url=True, required=False, allow_empty_file=True
    )

    class Meta:
        model = PicLogin
        fields = ["background_image"]
