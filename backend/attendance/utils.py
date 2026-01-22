from django.utils import timezone
from .models import AttendanceSession

def close_expired_sessions():
    AttendanceSession.objects.filter(
        is_active=True,
        end_time__lt=timezone.now()
    ).update(is_active=False)
