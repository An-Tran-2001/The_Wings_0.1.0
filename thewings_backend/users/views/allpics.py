from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from thewings_backend.paginate import StandardResultsSetPagination
from rest_framework.views import APIView
from thewings_backend.posts.models import File
from django.contrib.auth import get_user_model
from thewings_backend.users.serializers.allpics import AllPicsSerializer
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse

User = get_user_model()

class MyPics(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = AllPicsSerializer
    queryset = File.objects.none()
    lookup_field = "id"
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        queryset = File.objects.filter(post__author=self.request.user).order_by("-created_at")
        return queryset
    
    def get_serializer_context(self):
        return {"request": self.request, "user": self.request.user}


class YourPics(APIView):
    serializer_class = AllPicsSerializer
    queryset = File.objects.none()
    lookup_field = "id"
    pagination_class = StandardResultsSetPagination
    
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='page',
                type=int,
                description='Page number',
                required=False,
            ),
            OpenApiParameter(
                name='page_size',
                type=int,
                description='Number of results per page',
                required=False,
            ),
        ],
        responses=OpenApiResponse(response=AllPicsSerializer),
    )
    def get(self, request, username):
        user = User.objects.get(username=username)
        queryset = File.objects.get_files(request.user, user)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.serializer_class(
                page,
                many=True,
                context={"request": request},
            )
            return self.get_paginated_response(serializer.data)
        return Response(
            AllPicsSerializer(
                queryset,
                many=True,
                context={"request": request},
            ).data,
            status=status.HTTP_200_OK,
        )
    
    @property
    def paginator(self):
        """
        The paginator instance associated with the view, or None.
        """
        if not hasattr(self, '_paginator'):
            if self.pagination_class is None:
                self._paginator = None
            else:
                self._paginator = self.pagination_class()
        return self._paginator

    def paginate_queryset(self, queryset):
        """
        Return a single page of results, or None if pagination is disabled.
        """
        if self.paginator is None:
            return None
        return self.paginator.paginate_queryset(queryset, self.request, view=self)

    def get_paginated_response(self, data):
        """
        Return a paginated style Response object for the given output data.
        """
        assert self.paginator is not None
        return self.paginator.get_paginated_response(data)