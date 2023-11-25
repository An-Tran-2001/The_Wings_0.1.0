from rest_framework import serializers
from django.contrib.auth import get_user_model
from thewings_backend.posts.models import File
from rest_framework.serializers import HyperlinkedIdentityField

class AllPicsSerializer(serializers.ModelSerializer):
    # url = HyperlinkedIdentityField(
    #     view_name="api:user-detail",
    #     lookup_field="id",
    # )
    class Meta:
        model = File
        fields = "__all__"
        