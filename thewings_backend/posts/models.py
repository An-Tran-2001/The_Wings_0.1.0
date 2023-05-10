from django.db.models import Model, FileField, CharField, UUIDField, FileField, ForeignKey, ManyToManyField, DateTimeField, Index, OneToOneField
from django.contrib.auth import get_user_model
import uuid
# Create your models here.
User = get_user_model()
class Post(Model):
    STATUS = (
        ('public', 'Public'),
        ('private', 'Private'),
        ('private_only', 'Private Only'),
    )
    author = ForeignKey(User, on_delete=CharField, related_name='posts')
    tags = ManyToManyField(User, related_name='tagged_posts', blank=True)
    file = FileField(null=True, blank=True, upload_to='posts/')
    content = CharField(max_length=300, null=True, blank=True)
    like = ManyToManyField(User, related_name='liked_posts', blank=True)
    comment = ManyToManyField(User, related_name='commented_posts', blank=True, through='Comment')
    created_at = DateTimeField(auto_now_add=True)
    status = CharField(max_length=20, choices=STATUS, default='public')
    def __str__(self) -> str:
        return super().__str__()
    
    class Meta: 
        indexes = [
            Index(fields=['author', '-created_at'])
        ]
        ordering = ('-created_at',)
        
class Comment(Model):
    posts = ForeignKey(Post, on_delete=CharField, related_name='post_comments')
    users = ForeignKey(User, on_delete=CharField, related_name='users_comments')
    parent = ForeignKey('self', on_delete=CharField, related_name='parent_comments', null=True, blank=True)
    content = CharField(max_length=300, null=True, blank=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    likes = ManyToManyField(User, related_name='liked_comments', blank=True)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._parent = self.parent
    
    def __str__(self) -> str:
        return super().__str__()
    
    def save(self, *args, **kwargs):
        if self.content == None:
            raise Exception("You can't post empty comment")
        super().save(*args, **kwargs)
    
    class Meta:
        indexes = [
            Index(fields=['posts', '-created_at'])
        ]    
        ordering = ('-created_at',)