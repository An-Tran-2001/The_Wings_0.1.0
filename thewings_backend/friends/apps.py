from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class FriendsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "thewings_backend.friends"
    verbose_name = _("Friends")

    def ready(self):
        try:
            import friends.signals  # noqa: F401
        except ImportError:
            pass
