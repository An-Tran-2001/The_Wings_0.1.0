from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import GenericViewSet
from thewings_backend.paginate import StandardResultsSetPagination
from thewings_backend.posts.models import File
from thewings_backend.users.serializers.allpics import AllPicsSerializer


class YourPics(ListModelMixin, GenericViewSet):
    serializer_class = AllPicsSerializer
    queryset = File.objects.none()
    lookup_field = "id"
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        queryset = File.objects.filter(post__author=self.request.user).order_by("-created_at")
        return queryset