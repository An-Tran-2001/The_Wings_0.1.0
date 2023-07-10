from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class PostsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "thewings_backend.posts"
    verbose_name = _("Posts")

    def ready(self):
        try:
            import posts.signals  # noqa: F401
        except ImportError:
            pass
