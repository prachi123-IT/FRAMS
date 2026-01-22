import uuid
from django.db import models
from django.utils import timezone
from datetime import timedelta
from faculty.models import Faculty
from students.models import StudentProfile

class AttendanceSession(models.Model):
    faculty=models.ForeignKey(Faculty, on_delete=models.CASCADE)
    subject=models.CharField(max_length=100)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField()
    is_active=models.BooleanField(default=True)
    qr_token=models.UUIDField(default=uuid.uuid4, unique=True)

    def __str__(self):
        return f"{self.faculty.user.username} - {self.start_time}"
    

class AttendanceRecord(models.Model):
    session=models.ForeignKey(AttendanceSession, on_delete=models.CASCADE)
    student=models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_present = models.BooleanField(default=True)

    class Meta:
        unique_together = ('student', 'session')

    def __str__(self):
        return f"{self.student.roll_no} - {self.session.id}"