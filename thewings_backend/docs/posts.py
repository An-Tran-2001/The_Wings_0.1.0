from drf_spectacular.utils import extend_schema

from thewings_backend.posts.serializers import PostsSerializer


def get_all_post_docs() -> extend_schema:
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
