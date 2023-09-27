from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser


User = get_user_model()


class TokenAuthMiddleware:
    """
    Custom middleware that takes a token from the query string and authenticates using
    Django Rest Framework Simple JWT.
    """

    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        # Look up user from query string (you should also do things like
        # checking if it is a valid user ID, or if scope["user"] is already
        # populated).
        query_params = parse_qs(scope["query_string"].decode())
        token = query_params.get("token", [None])[0]
        if token:
            try:
                access_token = AccessToken(token)
                print(access_token.payload)
                user = await database_sync_to_async(User.objects.get)(id=access_token.payload["user_id"])
                if not user.is_active:
                    raise AuthenticationFailed(_("User inactive or deleted."))
                scope["user"] = user
            except InvalidToken:
                raise AuthenticationFailed(_("Invalid token."))
            except User.DoesNotExist:
                raise AuthenticationFailed(_("User not found."))
        else:
            raise AuthenticationFailed(_("Token not found."))

        return await self.app(scope, receive, send)


@database_sync_to_async
def get_user(scope):
    """
    Return the user model instance associated with the given scope.
    If no user is retrieved, return an instance of `AnonymousUser`.
    """
    return scope["user"]
