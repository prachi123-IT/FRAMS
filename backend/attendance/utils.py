from django.utils import timezone
from .models import AttendanceSession, AttendanceRecord
import hashlib

def close_expired_sessions():
    AttendanceSession.objects.filter(
        is_active=True,
        end_time__lt=timezone.now()
    ).update(is_active=False)

def calculate_attendance_percentage(student):
    sessions = AttendanceSession.objects.filter(year=student.year, semester=student.semester)
    total = sessions.count()
    if total == 0:
        return 0

    present = AttendanceRecord.objects.filter(student=student, session__in=sessions).count()
    return round((present / total) * 100, 2)
