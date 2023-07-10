from django.core.mail import EmailMessage, get_connection, send_mail
from django.conf import settings


class Util:
    @staticmethod
    def send_email(data):
        email = EmailMessage(
            subject=data["email_subject"],
            body=data["email_body"],
            from_email="from@example.com",
            to=[data["to_email"]],
        )
        email.send()
        connection = get_connection(
            host=settings.GMAIL_HOST,
            port=settings.GMAIL_PORT,
            username=settings.EMAIL_HOST_USER,
            password=settings.EMAIL_HOST_PASSWORD,
            use_tls=True,
        )
        send_mail(
            data["email_subject"],
            data["email_body"],
            "tranandeveloper@gmail.com",
            [data["to_email"]],
            connection=connection,
        )
