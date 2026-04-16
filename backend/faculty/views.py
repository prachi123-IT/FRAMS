from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from students.models import StudentProfile,AcademicRecord
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from attendance.utils import calculate_attendance_percentage
from attendance.models import AttendanceSession,AttendanceRecord
from collections import defaultdict
from datetime import datetime
from datetime import timedelta
from django.utils import timezone

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def faculty_dashboard(request):
    try:
        faculty = request.user.faculty
    except:
        return Response({"error": "Faculty profile not found"}, status=404)

    active_session = AttendanceSession.objects.filter(
        faculty=request.user,
        is_active=True
    ).first()

    if not active_session:
        return Response({
            "faculty": faculty.user.username,
            "students": []
        })

    students = StudentProfile.objects.filter(
        year=active_session.year,
        semester=active_session.semester
    )

    data = []

    for student in students:
        present = AttendanceRecord.objects.filter(
            student=student,
            session=active_session
        ).exists()

        data.append({
            "roll_no": student.roll_no,
            "name": student.user.username,
            "attendance": 100 if present else 0
        })

    return Response({
        "faculty": faculty.user.username,
        "subject": active_session.subject,
        "year": active_session.year,
        "semester": active_session.semester,
        "students": data
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_list_view(request):
    if request.user.role != 'FACULTY':
        return JsonResponse({'error': 'unauthorized'}, status=403)

    students = StudentProfile.objects.all()

    data = []
    for s in students:
        data.append({
            "roll_no": s.roll_no,
            "name": s.name,
            "department": s.department,
            "year": s.year
        })

    return JsonResponse({"students": data})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_academic_view(request, roll_no):

    if request.user.role != 'FACULTY':
        return JsonResponse({'error': 'unauthorized'}, status=403)

    try:
        student = StudentProfile.objects.get(roll_no=roll_no)
    except StudentProfile.DoesNotExist:
        return JsonResponse({'error': 'Student Not Found'}, status=404)

    # -------- Academic Records --------
    records = AcademicRecord.objects.filter(student=student).order_by("year", "semester")

    academic_data = []

    for r in records:
        marksheet_url = None

        if r.marksheet:
            try:
                marksheet_url = r.marksheet.url
            except:
                marksheet_url = None

        academic_data.append({
            "id": r.id,
            "semester": r.semester,
            "cgpa": r.cgpa,
            "verified": r.verified,
            "marksheet": marksheet_url
        })
    attendance_records = AttendanceRecord.objects.filter(student=student)

    subject_count = defaultdict(int)

    for a in attendance_records:
        subject = a.session.subject
        subject_count[subject] += 1

    attendance_data = []
    for subject, count in subject_count.items():
        attendance_data.append({
            "subject": subject,
            "attendance": count
        })

    # -------- Attendance Percentage --------
    total_classes = AttendanceSession.objects.count()
    attended = attendance_records.count()

    attendance_percentage = 0
    if total_classes > 0:
        attendance_percentage = round((attended / total_classes) * 100, 2)

    return JsonResponse({
    "roll_no": student.roll_no,
    "name": student.name,
    "department": student.department,
    "year": student.year,
    "semester": student.semester,
    "face_encoding": student.face_encoding,
    "academics": academic_data,
    "attendance": attendance_data,
    "attendance_percentage": attendance_percentage
})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_academic_record(request, record_id):
    if request.user.role != "FACULTY":
        return JsonResponse({"error": "Unauthorized"}, status=403)

    record = AcademicRecord.objects.get(id=record_id)
    record.verified = True
    record.save()

    return JsonResponse({"message": "Record verified"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def attendance_graph_view(request):

    if request.user.role != "FACULTY":
        return JsonResponse({"error": "Unauthorized"}, status=403)

    year = request.GET.get("year")
    semester = request.GET.get("semester")
    department = request.GET.get("branch")

    #  FILTER STUDENTS ONLY
    students_qs = StudentProfile.objects.all()

    if year:
        students_qs = students_qs.filter(year=year)

    if semester:
        students_qs = students_qs.filter(semester=semester)

    if department:
        students_qs = students_qs.filter(department=department)

    total_students = students_qs.count()

    if total_students == 0:
        return JsonResponse({"graph": []})

    sessions = AttendanceSession.objects.filter(
        faculty=request.user
    )

    if year:
        sessions = sessions.filter(year=year)

    if semester:
        sessions = sessions.filter(semester=semester)

    sessions = sessions.order_by("start_time")

    if not sessions.exists():
        return JsonResponse({"graph": []})

    days_order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    day_map = {day: {"present": 0, "absent": 0, "date": None} for day in days_order}

    for s in sessions:
        day = s.start_time.strftime("%a")
        date = str(s.start_time.date())

        present = AttendanceRecord.objects.filter(
            session=s,
            student__in=students_qs
        ).count()

        day_map[day]["present"] += present
        day_map[day]["absent"] += (total_students - present)
        day_map[day]["date"] = date

    graph_data = []

    for day in days_order:
        graph_data.append({
            "day": day,
            "present": day_map[day]["present"],
            "absent": day_map[day]["absent"],
            "date": day_map[day]["date"]
        })

    return JsonResponse({"graph": graph_data})
  

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def attendance_by_day(request, date):

    if request.user.role != "FACULTY":
        return JsonResponse({"error": "Unauthorized"}, status=403)

    from datetime import datetime
    date_obj = datetime.strptime(date, "%Y-%m-%d").date()
    year = request.GET.get("year")
    semester = request.GET.get("semester")
    department = request.GET.get("branch")
    students_qs = StudentProfile.objects.all()

    if department:
        students_qs = students_qs.filter(department=department)

    if year:
        students_qs = students_qs.filter(year=year)

    if semester:
        students_qs = students_qs.filter(semester=semester)

    sessions = AttendanceSession.objects.filter(
        faculty=request.user,
        start_time__date=date_obj
    )

    
    records = AttendanceRecord.objects.filter(
        session__in=sessions,
        student__in=students_qs
    )

    present_students = []
    present_ids = []

    for r in records:
        present_students.append({
            "name": r.student.user.username,
            "roll_no": r.student.roll_no
        })
        present_ids.append(r.student.id)


    absent_students = []

    for s in students_qs:
        if s.id not in present_ids:
            absent_students.append({
                "name": s.user.username,
                "roll_no": s.roll_no
            })

    return JsonResponse({
        "date": date,
        "present": present_students,
        "absent": absent_students
    })
