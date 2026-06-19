from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('creator', 'Creator'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    avatar_url = models.URLField(blank=True, null=True)

class Session(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    date_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)


class Booking(models.Model):
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    PAYMENT_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
    ]


    session = models.ForeignKey('Session', on_delete=models.CASCADE, related_name='bookings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    booked_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='pending')

    def __str__(self):
        return f"{self.user.username} - {self.session.title}"
