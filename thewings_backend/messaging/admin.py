# Register your models here.
#Register them in `chats/admin.py`:

from django.contrib import admin
from .models import Conversation, Message


admin.site.register(Conversation)
admin.site.register(Message)