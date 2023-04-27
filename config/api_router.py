from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from thewings_backend.users.api.views import UserViewSet
from thewings_backend.users.views import UserRegisterView
from thewings_backend.messaging.api.views import ConversationViewSet, MessageViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
# router.register("register", UserRegisterView, basename="register")
router.register("conversations", ConversationViewSet)
router.register("messages", MessageViewSet)

app_name = "api"
urlpatterns = router.urls
