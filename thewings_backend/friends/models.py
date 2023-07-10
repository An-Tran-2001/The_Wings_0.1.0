from django.db.models import (
    CASCADE,
    Model,
    ForeignKey,
    BooleanField,
    DateTimeField,
    OneToOneField,
    UUIDField,
)
from django.contrib.auth import get_user_model
import uuid
from rest_framework.response import Response

User = get_user_model()


# Create your models here.
class Friend(Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = ForeignKey(User, on_delete=CASCADE, related_name="friends")
    friend = ForeignKey(
        User, on_delete=CASCADE, related_name="friend_requests", null=False, blank=False
    )
    is_accepted = BooleanField(default=False)
    created_at = DateTimeField(auto_now_add=True)

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
