from django.urls import path
from .auth import *
from thewings_backend.users.views import (
    user_detail_view,
    user_redirect_view,
    user_update_view,
    user_create_profile_view,
)

app_name = "users"

urlpatterns += [
    path("create-profile/", view=user_create_profile_view, name="create_profile"),
    path("~redirect/", view=user_redirect_view, name="redirect"),
    path("~update/", view=user_update_view, name="update"),
    path("<str:username>/", view=user_detail_view, name="detail"),
]

