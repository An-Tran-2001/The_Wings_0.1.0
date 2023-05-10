from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter
from .views import *
from django.urls import path

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()
    
router.register("", PostsViewSet)

app_name = "posts"


urlpatterns = router.urls
    
