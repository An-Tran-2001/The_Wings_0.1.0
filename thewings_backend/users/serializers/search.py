from rest_framework import serializers

class SearchUserSerializer(serializers.Serializer):
    key_name = serializers.CharField(max_length=255, min_length=1)

    class Meta:
        fields = ["key_name"]
