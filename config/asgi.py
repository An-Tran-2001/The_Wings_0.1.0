"""
ASGI config for thewings_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/dev/howto/deployment/asgi/

"""
import os
import sys
from pathlib import Path
import django

from django.core.asgi import get_asgi_application

# This allows easy placement of apps within the interior
# thewings_backend directory.
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
sys.path.append(str(BASE_DIR / "thewings_backend"))

# If DJANGO_SETTINGS_MODULE is unset, default to the local settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")
django.setup()

# This application object is used by any ASGI server configured to use this file.
# django_application = get_asgi_application()
# Apply ASGI middleware here.
# from helloworld.asgi import HelloWorldApplication
# application = HelloWorldApplication(application)

# Import websocket application here, so apps from django_application are loaded first
from config.websocket import websocket_application  # noqa isort:skip


# async def application(scope, receive, send):
#     if scope["type"] == "http":
#         await django_application(scope, receive, send)
#     elif scope["type"] == "websocket":
#         await websocket_application(scope, receive, send)
#     else: 
#         raise NotImplementedError(f"Unknown scope type {scope['type']}")


from config import websocket_routing  # noqa isort:skip

from channels.routing import ProtocolTypeRouter, URLRouter  # noqa isort:skip
from channels.auth import AuthMiddlewareStack  # noqa isort:skip
from channels.security.websocket import AllowedHostsOriginValidator  # noqa isort:skip
from thewings_backend.messaging.middleware import TokenAuthMiddleware


# application = ProtocolTypeRouter(
#     {
#         "http": get_asgi_application(),
#         "websocket": AllowedHostsOriginValidator(
#             AuthMiddlewareStack(URLRouter(websocket_routing.websocket_urlpatterns))
#         ),
#     }
# )

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": 
            TokenAuthMiddleware(URLRouter(websocket_routing.websocket_urlpatterns))
    }
)