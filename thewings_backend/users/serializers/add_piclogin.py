from rest_framework.serializers import ModelSerializer, FileField
from ..models import PicLogin
class AddPicsLoginSerializer(ModelSerializer):
    
    background_image = FileField(max_length=None, use_url=True, required=False, allow_empty_file=True)
    
    class Meta:
        model = PicLogin
        fields = ['background_image']
    