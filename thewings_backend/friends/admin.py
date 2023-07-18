from django.contrib import admin

from .models import BlackFriend, Friend

# Register your models here.
admin.site.register(Friend)
admin.site.register(BlackFriend)