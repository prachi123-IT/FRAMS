import uuid
from django.db import models
from django.conf import settings
from students.models import StudentProfile
from django.utils import timezone

class AttendanceSession(models.Model):
    faculty = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'FACULTY'}
    )
    subject = models.CharField(max_length=100)
    year = models.IntegerField()
    semester = models.IntegerField()
    branch = models.CharField(max_length=50, null=True, blank=True)

    qr_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    last_qr_update = models.DateTimeField(null=True, blank=True)


    def __str__(self):
        return f"{self.subject} - {self.faculty}"


class AttendanceRecord(models.Model):
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE)
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    face_verified = models.BooleanField(default=False)
    marked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'session')
    
  



          