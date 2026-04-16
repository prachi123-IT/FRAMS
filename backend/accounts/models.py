from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES=(
        ('STUDENT','student'),
        ('FACULTY','faculty'),
        ('ADMIN','admin')
    )

    role=models.CharField(max_length=10, choices=ROLE_CHOICES, default="STUDENT")
    face_encoding = models.JSONField(null=True, blank=True)    

    def __str__(self):
        return self.username   