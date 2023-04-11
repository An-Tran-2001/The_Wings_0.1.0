from rest_framework import permissions
from .views.processing.env_variables import redis_instance

class IsAcessToken(permissions.BasePermission):
    def has_permission(self, request, view):
        return False if request.auth.token ==  redis_instance.get(request.user.email) else True