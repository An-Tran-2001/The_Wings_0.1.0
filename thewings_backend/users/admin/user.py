from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

from thewings_backend.users.forms import UserAdminChangeForm, UserAdminCreationForm
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from thewings_backend.users.models import *

User = get_user_model()


@admin.register(User)  # đăng ký model User vào admin
class UserAdmin(auth_admin.UserAdmin):
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("name", "email", "phone_number", "tc")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "phone_number",
                    "name",
                    "tc",
                    "is_staff",
                    "password1",
                    "password2",
                ),
            },
        ),
    )
    list_display = (
        "username",
        "email",
        "phone_number",
        "name",
        "tc",
        "is_staff",
        "is_superuser",
    )
    list_filter = ("is_staff", "is_superuser")
    search_fields = ("username", "email", "phone_number", "name")
    ordering = ("-date_joined",)
    filter_horizontal = ()


admin.site.register(Profile)
admin.site.register(PicLogin)
