import jwt
import redis
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from drf_spectacular.utils import OpenApiExample
import datetime
import random
from functools import wraps
import json
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from ...utils import Util

redis_instance = redis.StrictRedis(host='redis', port=6379, db=1)


def get_token_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def get_token_expiration_time(access_token):
    """
    Returns the expiration time of the JWT token in a datetime object.
    """
    time = jwt.decode(access_token, settings.SECRET_KEY, algorithms=['HS256'])['exp']
    return datetime.datetime.fromtimestamp(time)


NOT_FOUND_RESPONSE = OpenApiExample(
    "Not Found",
    description="User not found",
    value={
        "detail": "Not found."
    },
    response_only=True,
    status_codes=["404"],
)


def email(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        request = self.request
        email = request.data.get('email')
        name = request.data.get('name')
        code = random.randint(100000, 999999)
        body = {
            'email_subject': 'The wings send to you',
            'email_body': 'Hi ' + name + ', ' + 'your code is ' + str(code),
            'to_email': email,
        }
        print(body)
        # gửi lên mailhog
        Util.send_email(body)

        # lưu redis
        redis_cache(email, code, request.data)
        return func(self, *args, **kwargs)

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
            return Response({'detail': 'Redis error', 'error': e}, status=status.HTTP_400_BAD_REQUEST)

    return wrapper


def code(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        request = self.request
        email = request.data.get('email')
        code = request.data.get('code')
        keys = redis_instance.keys(f"{email}_*")
        if len(keys) == 0:
            return Response({'msg': 'Email is not valid'}, status=status.HTTP_400_BAD_REQUEST)
        key = f"{email}_code"
        value = f"{email}_value"
        if redis_instance.ttl(key) == -1:
            return Response({'msg': 'Code is expired'}, status=status.HTTP_400_BAD_REQUEST)
        elif redis_instance.ttl(key) == -2:
            return Response({'msg': 'Code is expired'}, status=status.HTTP_400_BAD_REQUEST)
        if int(redis_instance.get(key)) == int(code):
            data = json.loads(redis_instance.get(value))
            request.data.update(data)
            redis_instance.delete(key)
            redis_instance.delete(value)
            return func(self, *args, **kwargs)
        else:
            return Response({'detail': 'Code is not correct'}, status=status.HTTP_400_BAD_REQUEST)
    return wrapper
