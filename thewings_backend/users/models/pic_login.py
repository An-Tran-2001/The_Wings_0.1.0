from django.db.models import Model, FileField, CharField


class PicLogin(Model):
    background_image = FileField(null=False, blank=False, upload_to="login_pics/")

    def __str__(self):
        return self.background_image
