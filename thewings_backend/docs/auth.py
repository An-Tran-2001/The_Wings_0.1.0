from drf_spectacular.utils import extend_schema, inline_serializer, OpenApiExample
from drf_spectacular.openapi import OpenApiTypes
from thewings_backend.users.serializers import *
from rest_framework import status


def login_docs() -> extend_schema:
    """
    Docs for login
    """
    return extend_schema(
        description="login",
        request=UserLoginSerializer,
        responses={
            200: {
                "type": "object",
                "properties": {
                    "messaging": {"type": "string"},
                    "token": {
                        "type": "object",
                        "properties": {
                            "refresh": {"type": "string"},
                            "access": {"type": "string"},
                        },
                    },
                },
            },
            400: {
                "type": "object",
                "properties": {
                    "errors": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "message": {"type": "string"},
                                "password": {"type": "string"},
                            },
                        },
                    }
                },
            },
        },
    )


def register_docs() -> extend_schema:
    return extend_schema(
        description="register",
        request=UserRegisterSerializer,
        examples=[
            OpenApiExample(
                "Successful Response",
                value={
                    "data": {
                        "field1": "value1",
                    },
                    "message": "Send email success",
                },
            ),
            OpenApiExample(
                "Error Response", value={"field1": ["errormessage1", "errormessage1"]}
            ),
        ],
        responses={
            status.HTTP_201_CREATED: {
                "description": "User Registration successful",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {"data": {"type": "string"}},
                        }
                    }
                },
            },
            status.HTTP_400_BAD_REQUEST: OpenApiTypes.OBJECT,
        },
    )
