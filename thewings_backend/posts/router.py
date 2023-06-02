from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter
from .views import *
from django.urls import path

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()
    
router.register("", PostsViewSet)
router.register("my-posts", CreatePostViewSet)

app_name = "posts"


urlpatterns = router.urls

urlpatterns += [
    path("like-post/<int:id>/", LikePostView.as_view()),
    path("like-comment/<int:id>/", LikeCommentView.as_view()),
    path("comment/", CommentViewSet.as_view()),
]
    
