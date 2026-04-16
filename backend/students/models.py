from django.db import models
from django.conf import settings


class StudentProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    roll_no = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100, blank=True)
    department = models.CharField(max_length=100)
    year = models.IntegerField()
    semester = models.IntegerField(default=1)
    face_encoding = models.JSONField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class AcademicRecord(models.Model):
    SEMESTER_CHOICES = [
        (1, "Sem 1"), (2, "Sem 2"),
        (3, "Sem 3"), (4, "Sem 4"),
        (5, "Sem 5"), (6, "Sem 6"),
        (7, "Sem 7"), (8, "Sem 8"),
    ]

    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="academics"
    )

    year = models.IntegerField()
    semester = models.IntegerField(choices=SEMESTER_CHOICES)
    marksheet = models.FileField(upload_to="marksheets/", null=True, blank=True)
    cgpa = models.FloatField(default=0.0)
    verified = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'year', 'semester')

    def __str__(self):
        return f"{self.student.roll_no} - Y{self.year} S{self.semester}" 





    