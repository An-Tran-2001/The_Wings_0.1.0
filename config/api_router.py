from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from thewings_backend.messaging.api.views import ConversationViewSet, MessageViewSet
from thewings_backend.users.api.views import UserViewSet
from thewings_backend.users.views.allpics import YourPics

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
router.register("conversations", ConversationViewSet)
router.register("messages", MessageViewSet)
router.register("pics", YourPics)

app_name = "api"
urlpatterns = router.urls
