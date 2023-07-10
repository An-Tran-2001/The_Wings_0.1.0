import jwt
import redis
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from drf_spectacular.utils import OpenApiExample
import datetime
from rest_framework.response import Response
from rest_framework import status
import json

redis_instance = redis.StrictRedis(host="redis", port=6379, db=1)


def get_token_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


def get_token_expiration_time(access_token):
    """
    Returns the expiration time of the JWT token in a datetime object.
    """
    time = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])["exp"]
    return datetime.datetime.fromtimestamp(time)


NOT_FOUND_RESPONSE = OpenApiExample(
    "Not Found",
    description="User not found",
    value={"detail": "Not found."},
    response_only=True,
    status_codes=["404"],
)


def redis_cache(email, code, data):
    try:
        keys = redis_instance.keys(f"{email}_*")
        if len(keys) > 0:
            for key in keys:
                redis_instance.delete(key)

        key = f"{email}_code"
        value = f"{email}_value"

        redis_instance.set(key, code)
        redis_instance.set(value, json.dumps(data))
        redis_instance.expire(key, 30)
        redis_instance.expire(value, 3000)
    except Exception as e:
        return Response(
            {"detail": "Redis error", "error": e}, status=status.HTTP_400_BAD_REQUEST
        )
