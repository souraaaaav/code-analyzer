from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):

    def create_user(self, email, password, **extra_fields):
   
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, is_staff=extra_fields['is_staff'],
                          is_active=extra_fields['is_active'],
                          is_superuser=extra_fields['is_superuser'],)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None
    first_name = None
    last_name = None
    email = models.EmailField(_('email address'), unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()
    name = models.CharField(max_length=80)
    profile_pic = models.ImageField(upload_to='profile_pics/')
    phone = models.CharField(max_length=20)
    is_verified = models.BooleanField(default=False)
    is_customer = models.BooleanField(default=False)
    is_delivery_man = models.BooleanField(default=False)
    
    def __str__(self):
        return self.email

class Product(models.Model):
    BREAKFAST = 'Breakfast'
    LUNCH = 'Lunch'
    DINNER = 'Dinner'

    PRODUCT_TYPES = [
        (BREAKFAST, 'Breakfast'),
        (LUNCH, 'Lunch'),
        (DINNER, 'Dinner'),
    ]
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='product_images/')
    rating = models.FloatField(default=0.0)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES, default=BREAKFAST)

    def __str__(self):
        return self.name

class Package(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='package_images/')
    products = models.ManyToManyField(Product, related_name='packages')

    def __str__(self):
        return self.name
    
class Order(models.Model):
    ORDERED = 'ORDERED'
    COOK_READY = 'COOK_READY'
    ACCEPT = 'ACCEPT'
    PICKED_UP = 'PICKED_UP'
    DELIVERED = 'DELIVERED'

    STATUS_TYPES = [
        (ORDERED, _('Ordered')),
        (COOK_READY, _('Cooked Ready')),
        (ACCEPT, _('Accept')),
        (PICKED_UP, _('Picked Up')),
        (DELIVERED, _('Delivered')),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='order_product_user')
    name = models.CharField(max_length=255)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    bill = models.TextField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_id = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_TYPES, default=ORDERED)
    otp = models.CharField(max_length=20,default=0)
    delivery_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='delivery_product_user',null=True,blank=True)
    cod = models.BooleanField(default=False)
    def __str__(self):
        return f"Order #{self.pk} - {self.user.email}"

class OrderProduct(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE,related_name='order_products')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.quantity} x {self.product.name} - Order #{self.order.pk}"
    
class PackageOrder(models.Model):
    ORDERED = 'ORDERED'
    COOK_READY = 'COOK_READY'
    ACCEPT = 'ACCEPT'
    PICKED_UP = 'PICKED_UP'
    DELIVERED = 'DELIVERED'

    STATUS_TYPES = [
        (ORDERED, _('Ordered')),
        (COOK_READY, _('Cooked Ready')),
        (ACCEPT, _('Accept')),
        (PICKED_UP, _('Picked Up')),
        (DELIVERED, _('Delivered')),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='order_package_user')
    name = models.CharField(max_length=255)
    address = models.TextField()
    bill = models.TextField(default='')
    phone = models.CharField(max_length=20)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_id = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='package_orders')
    status = models.CharField(max_length=20, choices=STATUS_TYPES, default=ORDERED)
    otp = models.CharField(max_length=20, default=0)
    delivery_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='delivery_package_user',null=True,blank=True)
    cod = models.BooleanField(default=False)
    def __str__(self):
        return f"Package Order #{self.pk} - {self.user.email}"

class PackageOrderProduct(models.Model):
    package_order = models.ForeignKey(PackageOrder, on_delete=models.CASCADE,related_name='package_order_products')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.quantity} x {self.product.name} - Package Order #{self.package_order.pk}"


class ProductComment(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.name} on {self.product.name}"

class ProductRating(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_rating')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.name} on {self.product.name}"

