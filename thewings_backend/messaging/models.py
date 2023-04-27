from django.apps import apps
apps.check_apps_ready()
from django.db.models import CASCADE, Model, ForeignKey, DateTimeField, TextField, CharField, ManyToManyField
import uuid
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=128)
    online = models.ManyToManyField(to=User, blank=True)

    def get_online_count(self):
        return self.online.count()

    def join(self, user):
        self.online.add(user)
        self.save()

    def leave(self, user):
        self.online.remove(user)
        self.save()

    def __str__(self):
        return f"{self.name} ({self.get_online_count()})"


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages"
    )
    from_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="messages_from_me"
    )
    to_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="messages_to_me"
    )
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"From {self.from_user.username} to {self.to_user.username}: {self.content} [{self.timestamp}]"


class GroupChat(Model):
    name = CharField(max_length=100)
    members = ManyToManyField(User, through='GroupChatMember', related_name='group_chats')

class GroupChatMember(Model):
    group_chat = ForeignKey(GroupChat, on_delete=CASCADE)
    user = ForeignKey(User, on_delete=CASCADE)
    created_at = DateTimeField(auto_now_add=True)


class GroupChatMessage(Model):
    group_chat = ForeignKey(GroupChat, on_delete=CASCADE, related_name='messages')
    sender = ForeignKey(User, on_delete=CASCADE)
    content = TextField()
    created_at = DateTimeField(auto_now_add=True)