from thewings_backend.users.processing.env_variables import redis_instance
import datetime
import random
from functools import wraps
import json
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from thewings_backend.utils import Util


# bỏ cách dùng decorator làm processing vì không đúng nguyên tắc phải kiểm tra is_valid trước ms xử lý
def email(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        request = self.request
        email = request.data.get("email")
        name = request.data.get("name")
        code = random.randint(100000, 999999)
        body = {
            "email_subject": "The wings send to you",
            "email_body": "Hi " + name + ", " + "your code is " + str(code),
            "to_email": email,
        }
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
            return Response(
                {"detail": "Redis error", "error": e},
                status=status.HTTP_400_BAD_REQUEST,
            )

    return wrapper


def code(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        request = self.request
        email = request.data.get("email")
        code = request.data.get("code")
        keys = redis_instance.keys(f"{email}_*")
        if len(keys) == 0:
            return Response(
                {"msg": "Email is not valid"}, status=status.HTTP_400_BAD_REQUEST
            )
        key = f"{email}_code"
        value = f"{email}_value"
        if redis_instance.ttl(key) == -1:
            return Response(
                {"msg": "Code is expired"}, status=status.HTTP_400_BAD_REQUEST
            )
        elif redis_instance.ttl(key) == -2:
            return Response(
                {"msg": "Code is expired"}, status=status.HTTP_400_BAD_REQUEST
            )
        if int(redis_instance.get(key)) == int(code):
            data = json.loads(redis_instance.get(value))
            request.data.update(data)
            redis_instance.delete(key)
            redis_instance.delete(value)
            return func(self, *args, **kwargs)
        else:
            return Response(
                {"detail": "Code is not correct"}, status=status.HTTP_400_BAD_REQUEST
            )

    return wrapper


def recode(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        request = self.request
        email = request.data.get("email")
        user = json.loads(redis_instance.get(f"{email}_value"))
        code = random.randint(100000, 999999)
        body = {
            "email_subject": "The wings send to you",
            "email_body": "Hi " + user["name"] + ", " + "your code is " + str(code),
            "to_email": email,
        }
        Util.send_email(body)
        key = f"{email}_code"
        if redis_instance.get(key) is not None:
            redis_instance.delete(key)
        redis_instance.set(key, code)
        redis_instance.expire(key, 300)
        return func(self, *args, **kwargs)

    return wrapper
