# Generated by Django 4.2 on 2023-06-01 04:22

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("posts", "0002_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="post",
            old_name="like",
            new_name="likes",
        ),
    ]
