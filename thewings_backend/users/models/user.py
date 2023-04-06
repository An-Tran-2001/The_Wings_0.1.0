from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models import CharField, EmailField, DateTimeField, BooleanField, Index
from django.core.validators import RegexValidator, MinLengthValidator
from django.urls import reverse
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _
from django.utils import timezone



class UserManager(BaseUserManager):
    def create_user(self, username, email, phone_number, name, tc, password=None, password2=None, **kwargs):
        """
        Creates and saves a User with the given email, name, tc and password.
        """
        if not username:
            raise ValueError('User must have an user name')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            phone_number=phone_number,
            name=name,
            tc=tc,
        )
        
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email,phone_number, name, tc, password=None):
        """
        Creates and saves a superuser with the given email, name, tc and password.
        """
        user = self.create_user(
            username,
            email,
            phone_number,
            password=password,
            name=name,
            tc=tc,
        )
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractUser):
    """
    Default custom user model for thewings_backend.
    If adding fields that need to be filled at user signup,
    check forms.SignupForm and forms.SocialSignupForms accordingly.
    """

    #: First and last name do not cover name patterns around the globe
    name = CharField(_("Name of User"), blank=True, max_length=255)
    first_name = None  # type: ignore
    last_name = None  # type: ignore
    email = EmailField(verbose_name='Email', unique=True, null=False, blank=False)
    phone_number = PhoneNumberField(verbose_name='Phone Number', unique=True, null=True, blank=True)
    username = CharField(verbose_name='User Name', max_length=100, unique=True, validators=[RegexValidator(regex='^[a-zA-Z0-9]*$', message='User Name must be Alphanumeric', code='invalid_user_name')])
    password = CharField(verbose_name='Password', max_length=500, validators=[RegexValidator(regex='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d](?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', message='Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character', code='invalid_password')])
    tc = BooleanField(verbose_name='TC', default=False)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(auto_now_add=True, null=True)
    updated_at = DateTimeField(auto_now=True)
    objects = UserManager()
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email','phone_number','name','tc']
    def get_absolute_url(self): # hàm kế thừa custom lại để trả về url của user detail view khi gọi hàm get_absolute_url
        """Get url for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("users:detail", kwargs={"username": self.username})
    
    def __str__(self) -> str: # hàm kế thừa custom lại để trả về string của user
        return super().__str__()
    
    def has_perm(self, perm, obj=None): # phương thức kế thừa custom lại để trả về true nếu user là superuser để câp quyền truy cập vào admin
        return self.is_staff
    
    def has_module_perms(self, app_label):
        return True
    
    class Meta:
        verbose_name = 'User' # tên hiển thị của model
        verbose_name_plural = 'Users' # tên hiển thị số nhiều của model
        ordering = ['-created_at'] # sắp xếp theo thứ tự giảm dần của created_at
        # tạo index cho các trường username, email, phone_number
        indexes = [
            Index(fields=['username', 'email', 'phone_number']),
        ]
