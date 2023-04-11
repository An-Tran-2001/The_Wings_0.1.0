from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

class UserLogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    class Meta:
        fields = ['refresh']

    default_error_messages = {
        'bad_token': ('Token is expired or invalid')
    }

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except Exception as e:
            self.fail('bad_token')