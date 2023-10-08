import uuid

from django.contrib.auth import get_user_model
from django.db.models import (
    CASCADE,
    BooleanField,
    DateTimeField,
    ForeignKey,
    Model,
    UUIDField,
    Manager,
    Q
)

User = get_user_model()


class FriendManager(Manager):
    def are_friends(self, user1, user2):
        return self.filter(
            (Q(user=user1.id, friend=user2.id) | Q(user=user2.id, friend=user1.id)),
            is_accepted=True
        ).exists()
        
    def are_send_requested(self, user1, user2):
        print("here ư")
        return self.filter(user=user1.id, friend=user2.id, is_accepted=False).exists()
    
    def are_receive_requested(self, user1, user2):
        return self.filter(user=user2.id, friend=user1.id, is_accepted=False).exists()


class Friend(Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = ForeignKey(User, on_delete=CASCADE, related_name="friends")
    friend = ForeignKey(
        User, on_delete=CASCADE, related_name="friend_requests", null=False, blank=False
    )
    is_accepted = BooleanField(default=False)
    created_at = DateTimeField(auto_now_add=True)

    objects = FriendManager()
    def __str__(self) -> str:
        return super().__str__()

    class Meta:
        unique_together = ("user", "friend")
        ordering = ("-created_at",)


class BlackFriend(Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = ForeignKey(User, on_delete=CASCADE, related_name="black_friends")
    black_friend = ForeignKey(
        User,
        on_delete=CASCADE,
        related_name="black_friend_requests",
        null=False,
        blank=False,
    )
    created_at = DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return super().__str__()

    def save(self, *args, **kwargs):
        if self.user == self.black_friend:
            raise Exception("You can't add yourself to blacklist")
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ("user", "black_friend")
        ordering = ("-created_at",)
