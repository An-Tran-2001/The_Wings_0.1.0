from drf_spectacular.utils import extend_schema , extend_schema_field
from drf_spectacular.openapi import OpenApiTypes
from thewings_backend.posts.serializers import *

tags = ["Posts"]



# def get_post_docs():
      
#     return extend_schema(
#         tags=tags,
#         description="Get all posts",
#         request=PostsSerializer,
#         responses={
#             200: {
#                 "type": "object",
#                 "properties": {
#                     "posts": {
#                         "type": "array",        
#                         "items": {
#                             "type": "object",
#                             "$ref": "#/components/schemas/Posts",
#                         }
#                     }
#                 }
#             }
#         },
        
#         overrides = {
#             "comments" : {
#                 "type": "array",
#                 "items": {
#                     "type": "object",
#                     "$ref": "#/components/schemas/Comments",
#                     "properties": {
#                         "comments": {
#                             "type": "array",
#                             "items": {
#                                 "type": "object",
#                                 "$ref": "#/components/schemas/Comments",
#                             }
#                         }
#                     }
#                 }
#             }
#         }
#     )

def get_post_docs():
    return extend_schema_field(
        {
            "comments" : {
                "type": "array",
                "items": {
                    "type": "object",
                    "$ref": "#/components/schemas/Comments",
                    "properties": {
                        "comments": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "$ref": "#/components/schemas/Comments",
                            }
                        }
                    }
                }
            }
        }
    )(
        extend_schema(
            tags=tags,
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
                            }
                        }
                    }
                }
            },
        )
    )
    