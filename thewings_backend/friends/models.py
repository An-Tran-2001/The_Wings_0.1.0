from django.db.models import CASCADE, Model, ForeignKey, BooleanField, DateTimeField
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.
class Friend(Model):
    user = ForeignKey(User, on_delete=CASCADE, related_name='friends')
    friend = ForeignKey(User, on_delete=CASCADE, related_name='friend_requests')
    is_accepted = BooleanField(default=False)
    created_at = DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'friend')
        ordering = ('-created_at',)