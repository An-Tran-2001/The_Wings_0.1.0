from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class NotificationsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "thewings_backend.notifications"
    verbose_name = _("Notifications")
    
    def ready(self):
        try:
            import notifications.signals  # noqa: F401
        except ImportError:
            pass
        
