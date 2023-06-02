# Generated by Django 4.2 on 2023-05-30 08:33

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import phonenumber_field.modelfields


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "is_staff",
                    models.BooleanField(
                        default=False,
                        help_text="Designates whether the user can log into this admin site.",
                        verbose_name="staff status",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name="date joined"
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        blank=True, max_length=255, verbose_name="Name of User"
                    ),
                ),
                (
                    "first_name",
                    models.CharField(
                        blank=True, max_length=255, verbose_name="First Name"
                    ),
                ),
                (
                    "last_name",
                    models.CharField(
                        blank=True, max_length=255, verbose_name="Last Name"
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        max_length=254, unique=True, verbose_name="Email"
                    ),
                ),
                (
                    "phone_number",
                    phonenumber_field.modelfields.PhoneNumberField(
                        max_length=128,
                        region=None,
                        unique=True,
                        verbose_name="Phone Number",
                    ),
                ),
                (
                    "username",
                    models.CharField(
                        max_length=100,
                        unique=True,
                        validators=[
                            django.core.validators.RegexValidator(
                                code="invalid_user_name",
                                message="User Name must be Alphanumeric",
                                regex="^[a-zA-Z0-9]*$",
                            )
                        ],
                        verbose_name="User Name",
                    ),
                ),
                (
                    "password",
                    models.CharField(
                        max_length=500,
                        validators=[
                            django.core.validators.RegexValidator(
                                code="invalid_password",
                                message="Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character",
                                regex="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d](?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                            )
                        ],
                        verbose_name="Password",
                    ),
                ),
                ("tc", models.BooleanField(default=False, verbose_name="TC")),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "User",
                "verbose_name_plural": "Users",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="PicLogin",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("background_image", models.FileField(upload_to="login_pics/")),
            ],
        ),
        migrations.CreateModel(
            name="Profile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("bio", models.TextField(blank=True, max_length=300, null=True)),
                (
                    "avatar",
                    models.ImageField(blank=True, null=True, upload_to="avatars/"),
                ),
                (
                    "cover_image",
                    models.ImageField(blank=True, null=True, upload_to="cover_images/"),
                ),
                ("address", models.CharField(blank=True, max_length=100, null=True)),
                ("sex", models.CharField(max_length=10)),
                ("birth_date", models.DateField()),
                (
                    "followers",
                    models.ManyToManyField(
                        blank=True,
                        related_name="followers",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "following",
                    models.ManyToManyField(
                        blank=True,
                        related_name="following",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="profile",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddIndex(
            model_name="user",
            index=models.Index(
                fields=["username", "email", "phone_number"],
                name="users_user_usernam_cab68a_idx",
            ),
        ),
    ]
