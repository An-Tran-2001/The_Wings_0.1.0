from django.db.models import CASCADE, Model, ForeignKey, DateTimeField, TextField, CharField, ManyToManyField
from django.contrib.auth import get_user_model
User = get_user_model()

class Message(Model):
    sender = ForeignKey(User, on_delete=CASCADE, related_name='sent_messages')
    receiver = ForeignKey(User, on_delete=CASCADE, related_name='received_messages')
    content = TextField()
    created_at = DateTimeField(auto_now_add=True)

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