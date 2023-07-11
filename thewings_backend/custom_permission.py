from rest_framework import permissions
from thewings_backend.users.processing.env_variables import redis_instance
from thewings_backend.posts.models import Post, Comment
from thewings_backend.friends.models import Friend
from django.db.models import Q


class IsAcessToken(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            False
            if request.auth.token == redis_instance.get(request.user.email)
            else True
        )


class IsAuthor(permissions.BasePermission):
    def has_permission(self, request, view, *args, **kwargs):
        try:
            if post_id := view.kwargs[view.lookup_field]:
                post = Post.objects.get(id=post_id)
                return post.author == request.user
        except:
            if post_id := request.data.get("post"):
                post = Post.objects.get(id=post_id)
                return post.author == request.user
        return True


class IsFriend(permissions.BasePermission):
    def has_permission(self, request, view):
        post_id = view.kwargs[view.lookup_field]
        post = Post.objects.get(id=post_id)
        return post.author in request.user.friends.all()


class PostStatus(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            if post_id := view.kwargs[view.lookup_field]:
                post = Post.objects.get(id=post_id)
                return post.author == request.user
        except:
            if post_id := request.data.get("post"):
                post = Post.objects.get(id=post_id)
            elif post_id := request.data.get("posts"):
                post = Post.objects.get(id=post_id[0])
            if post.status == "public":
                return True
            elif post.status == "private":
                friend = Friend.objects.filter(
                    Q(Q(user=post.author) | Q(friend=post.author) & Q(is_accepted=True))
                ).values("user", "friend")
                return request.user in friend
            elif post.status == "private_only":
                return False
        return True
