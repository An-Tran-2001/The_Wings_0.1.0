from django.urls import path
from thewings_backend.messaging.consumers import ChatConsumer
websocket_urlpatterns = [
    path("messaging/", ChatConsumer.as_asgi()),
]