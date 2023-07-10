from drf_spectacular.utils import extend_schema, extend_schema_field
from drf_spectacular.openapi import OpenApiTypes
from thewings_backend.posts.serializers import *


def get_all_post_docs():
    """
    Posts is serializer Post main
    """
    return extend_schema(
        description="Get all posts",
        request=PostsSerializer,
        responses={
            200: {
                "type": "object",
                "properties": {
                    "posts": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "$ref": "#/components/schemas/Posts",
                        },
                    }
                },
            }
        },
    )
