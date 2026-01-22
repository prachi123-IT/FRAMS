from django.db import models
from accounts.models import User

class StudentProfile(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE)
    roll_no =models.CharField(max_length=20, unique=True)
    department=models.CharField(max_length=100)
    year=models.IntegerField()
    face_encoding=models.JSONField(blank=True, null=True)
    
    def __str__(self):
        return self.roll_no

class  AcademicRecord(models.Model):
    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="records"
    )
    semester = models.IntegerField()
    attendance_percentage = models.FloatField()
    cgpa = models.FloatField()

    class Meta:
        unique_together = ('student', 'semester')

    def __str__(self):
        return f"{self.student.roll_no} - Sem {self.semester}"

class Attendance(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField(auto_now_add=True)
    status = models.CharField(max_length=10, default="PRESENT")

    class Meta:
        unique_together = ('student', 'date')

    def __str__(self):
        return f"{self.student.roll_no} - {self.date}"
