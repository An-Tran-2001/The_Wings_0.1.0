from django.urls import path

from thewings_backend.users.views import (
    user_detail_view,
    user_redirect_view,
    user_update_view,
    user_register_view,
    confirm_register_view,
)

app_name = "users"
# urlpatterns = [
#     path("~redirect/", view=user_redirect_view, name="redirect"),
#     path("~update/", view=user_update_view, name="update"),
#     path("<str:username>/", view=user_detail_view, name="detail"),
# ]

urlpatterns = [
    path("register/", view=user_register_view, name="register"),
    path("register-confirm/", view=confirm_register_view, name="confirm"),
]
