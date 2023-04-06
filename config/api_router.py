from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from thewings_backend.users.api.views import UserViewSet
from thewings_backend.users.views import UserRegisterView

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
# router.register("register", UserRegisterView, basename="register")


app_name = "api"
urlpatterns = router.urls
