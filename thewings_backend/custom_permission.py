from rest_framework import permissions
from .users.views.processing.env_variables import redis_instance
from thewings_backend.posts.models import Post, Comment

class IsAcessToken(permissions.BasePermission):
    def has_permission(self, request, view):
        return False if request.auth.token ==  redis_instance.get(request.user.email) else True

class PermissionPosts(permissions.BasePermission):
    def has_permission(self, request, *args, **kwargs):
        # if request.method == 'GET':
        #     id = kwargs.get('id')
        #     post = Post.objects.get(id=id)
        #     if post.status == 'public':
        #         return True
        #     elif post.status == 'private_only':
        #         return False
        #     elif post.status == 'private':
        #         if request.user == post.author:
        #             return True
        #         elif request.user in post.tags.all():
        #             return True
        #         elif (request.user in post.author.followers.all()) or (request.user in post.author.following.all()) or (request.user in post.author.friends.all()):
        #             return True
        #         else:
        #             return False
        return True
        