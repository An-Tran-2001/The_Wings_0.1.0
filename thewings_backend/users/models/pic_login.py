from django.db.models import FileField, Model


class PicLogin(Model):
    background_image = FileField(null=False, blank=False, upload_to="login_pics/")

    def __str__(self):
        return self.background_image
