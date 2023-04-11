from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

class MessagingConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "thewings_backend.messaging"
    verbose_name = _("Messaging")
    
    def ready(self):
        try:
            import messaging.signals  # noqa: F401
        except ImportError:
            pass