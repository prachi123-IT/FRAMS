from django.db import models
from accounts.models import User

class Faculty(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    department=models.CharField(max_length=100)

    def __str__(self):
        return self.user.username
    
