from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AcademicRecord
from students.services.academic_utils import calculate_cgpa

@receiver(post_save, sender=AcademicRecord)
def update_cgpa(sender, instance, **kwargs):
    if instance.verified:
        student = instance.student
        student.cgpa = calculate_cgpa(student)
        student.save()
