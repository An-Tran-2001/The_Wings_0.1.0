from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class MessagingConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "thewings_backend.messaging"
    verbose_name = _("Messaging")

    def ready(self):
        from django.utils.module_loading import autodiscover_modules

        autodiscover_modules("thewings_backend.messaging.consumers")
