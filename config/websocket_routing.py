from django.urls import path
from thewings_backend.messaging.consumers import ChatConsumer, NotificationConsumer
websocket_urlpatterns = [
    path("messaging/<conversation_name>/", ChatConsumer.as_asgi()),
    path("notifications/", NotificationConsumer.as_asgi()),
]