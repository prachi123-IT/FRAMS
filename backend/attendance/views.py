from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from .models import AttendanceSession,AttendanceRecord
from faculty.models import Faculty
from datetime import timedelta
from django.contrib.auth.decorators import login_required
from students.models import StudentProfile
from .utils import close_expired_sessions


@login_required
def start_attendance(request):
    if request.user.role!='FACULTY':
        return JsonResponse({'error':'Unauthorized'}, status=403)
    
    faculty=Faculty.objects.get(user=request.user)
    session = AttendanceSession.objects.create(
        faculty=faculty,
        end_time=timezone.now() + timedelta(minutes=10)
    )

    return JsonResponse({
        'message': 'Attendance started',
        'qr_token': str(session.qr_token),
        'end_time': session.end_time
    }) 

@login_required
def mark_attendance(request, qr_token):
    close_expired_sessions()
    if request.user.role != 'STUDENT':
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    try:
        session = AttendanceSession.objects.get(
            qr_token=qr_token,
            is_active=True,
            end_time__gte=timezone.now()
        )
    except AttendanceSession.DoesNotExist:
        return JsonResponse({'error': 'Session expired or invalid'}, status=400)

    student = StudentProfile.objects.get(user=request.user)

    record, created = AttendanceRecord.objects.get_or_create(
        student=student,
        session=session
    )

    if not created:
        return JsonResponse({'message': 'Already marked'})

    return JsonResponse({'message': 'Attendance marked successfully'})

@login_required
def attendance_history(request):
    if request.user.role != 'STUDENT':
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    student = StudentProfile.objects.get(user=request.user)

    records = AttendanceRecord.objects.filter(student=student).order_by('-session__start_time')

    data = []
    for r in records:
        data.append({
            'subject': r.session.subject,
            'date': r.session.start_time.date(),
            'start_time': r.session.start_time,
            'end_time': r.session.end_time,
        })

    return JsonResponse({
        'student': student.roll_no,
        'attendance': data
    })
