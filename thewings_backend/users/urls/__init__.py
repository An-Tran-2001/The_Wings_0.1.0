from django.urls import path

from thewings_backend.users.views import (
    user_detail_view,
    user_redirect_view,
    user_update_view,
    user_register_view,
    confirm_register_view,
    recode_register_view, 
    user_login_view,
    user_forgot_password_view,
    user_reset_password_view,
)

app_name = "users"

urlpatterns = [
    path("login/", view=user_login_view, name="login"),
    path("register/", view=user_register_view, name="register"),
    path("register-confirm/", view=confirm_register_view, name="confirm"),
    path("register-recode/", view=recode_register_view, name="recode"), 
    path("forgot-password/", view=user_forgot_password_view, name="forgot"),
    path("reset-password/", view=user_reset_password_view, name="reset"),
    path("~redirect/", view=user_redirect_view, name="redirect"),
    path("~update/", view=user_update_view, name="update"),
    path("<str:username>/", view=user_detail_view, name="detail"),
]
