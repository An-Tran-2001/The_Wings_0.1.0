from django.db.models import CharField, OneToOneField, CASCADE, TextField, ImageField, DateField, ManyToManyField, Model
from django.core.validators import RegexValidator, MinLengthValidator
from django.contrib.auth import get_user_model
User = get_user_model()

class Profile(Model):
    user = OneToOneField(User, on_delete=CASCADE, related_name='profile', null= False, blank= False)
    bio = TextField(null=True, blank=True, max_length=300)
    avatar = ImageField(null=True, blank=True, upload_to='avatars/')
    cover_image = ImageField(null=True, blank=True, upload_to='cover_images/')
    address = CharField(max_length=100, null=True, blank=True)
    following = ManyToManyField(User, related_name='following', blank=True)
    followers = ManyToManyField(User, related_name='followers', blank=True)
    sex = CharField(max_length=10, null=False, blank=False)
    birth_date = DateField(null=False, blank=False)
