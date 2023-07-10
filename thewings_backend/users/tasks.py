from django.contrib.auth import get_user_model
from celery import shared_task


from config import celery_app
from .views.processing.env_variables import redis_cache, redis_instance
import random
from ..utils import Util
import json

User = get_user_model()


@celery_app.task()
def get_users_count():
    """A pointless Celery task to demonstrate usage."""
    return User.objects.count()


@celery_app.task()
def send_email_signup(serializer_data):
    """A pointless Celery task to demonstrate usage."""
    email = serializer_data.get("email")
    name = serializer_data.get("name")
    code = random.randint(100000, 999999)
    body = {
        "email_subject": "The wings send to you",
        "email_body": "Hi " + name + ", " + "your code is " + str(code),
        "to_email": email,
    }
    # gửi lên mailhog
    Util.send_email(body)

    # lưu redis
    redis_cache(email, code, serializer_data)


@celery_app.task()
def resend_email_signup(email):
    """A pointless Celery task to demonstrate usage."""
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
