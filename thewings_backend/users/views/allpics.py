from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from thewings_backend.paginate import StandardResultsSetPagination
from rest_framework.views import APIView
from thewings_backend.posts.models import File
from django.contrib.auth import get_user_model
from thewings_backend.users.serializers.allpics import AllPicsSerializer
from rest_framework.response import Response
from rest_framework import status

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
    
    def get(self, request, username):
        user = User.objects.get(username=username)
        queryset = File.objects.get_files(request.user, user)
        return Response(
            AllPicsSerializer(
                queryset,
                many=True,
                context={"request": request},
            ).data,
            status=status.HTTP_200_OK,
        )
        # try:
        #     user = User.objects.get(username=username)
        #     queryset = File.objects.get_files(request.user, user)
        #     return Response(
        #         AllPicsSerializer(
        #             queryset,
        #             many=True,
        #             context={"request": request},
        #         ).data,
        #         status=status.HTTP_200_OK,
        #     )
        # except:
        #     return Response(
        #         {"message": "User not found"},
        #         status=status.HTTP_400_BAD_REQUEST,
        #     )