from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import AttendanceSession, AttendanceRecord
from students.models import StudentProfile
from .utils import close_expired_sessions
import uuid
import base64
import numpy as np
import cv2
import face_recognition


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_attendance(request):
    if request.user.role != "FACULTY":
        return Response({"error": "Unauthorized"}, status=403)

    session = AttendanceSession.objects.create(
        faculty=request.user,
        subject=request.data["subject"],
        year=request.data["year"],
        semester=request.data["semester"],
        end_time=timezone.now() + timedelta(minutes=5)
    )

    return Response({
        "qr_token": str(session.qr_token),
        "session_id": session.id
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def verify_qr(request, qr_token):
    close_expired_sessions()

    if request.user.role != "STUDENT":
        return Response({"error": "Unauthorized"}, status=403)

    try:
        session = AttendanceSession.objects.get(is_active=True)
    except AttendanceSession.DoesNotExist:
        return Response({"error": "No active session"}, status=400)

    if str(session.qr_token) != str(qr_token):
        return Response({"error": "OLD QR or INVALID QR"}, status=403)

    if timezone.now() > session.end_time:
        session.is_active = False
        session.save()
        return Response({"error": "Session expired"}, status=403)

    return Response({
        "message": "QR valid",
        "session_id": session.id
    })



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_attendance_face(request, session_id):
    if request.user.role != "STUDENT":
        return Response({"error": "Unauthorized"}, status=403)

    try:
        session = AttendanceSession.objects.get(
            id=session_id,
            is_active=True,
            end_time__gte=timezone.now()
        )
    except AttendanceSession.DoesNotExist:
        return Response({"error": "Session expired"}, status=400)

    student = StudentProfile.objects.get(user=request.user)

    if not student.face_encoding:
        return Response({"error": "Face not registered"}, status=400)

    image_data = request.data.get("image")

    if not image_data:
        return Response({"error": "No image received"}, status=400)

    img_bytes = base64.b64decode(image_data)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    face_locations = face_recognition.face_locations(img)

    if not face_locations:
        return Response({"error": "No face detected"}, status=400)

    encoding = face_recognition.face_encodings(img, face_locations)[0]

    known_encoding = np.array(student.face_encoding)

    match = face_recognition.compare_faces([known_encoding], encoding)[0]

    if not match:
        return Response({"error": "Face not matched"}, status=403)

    record, created = AttendanceRecord.objects.get_or_create(
        session=session,
        student=student
    )

    record.face_verified = True
    record.save()

    return Response({"message": "Attendance marked successfully"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_qr_session(request, qr_token):
    try:
        session = AttendanceSession.objects.get(
        qr_token=qr_token,
        is_active=True,
        end_time__gte=timezone.now()
    )
    except AttendanceSession.DoesNotExist:
        return Response({"error": "Session expired"}, status=400)
    return Response({"status":"active"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def live_qr(request, session_id):
    close_expired_sessions()
    try:
        session = AttendanceSession.objects.get(id=session_id)
    except AttendanceSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)

    if not session.is_active or timezone.now() > session.end_time:
        session.is_active = False
        session.save()
        return Response({"error": "Session expired"}, status=403)

    # rotate QR every 5 seconds
    if not session.last_qr_update or (timezone.now() - session.last_qr_update).seconds >= 5:
        session.qr_token = uuid.uuid4()
        session.last_qr_update = timezone.now()
        session.save()

    remaining = int((session.end_time - timezone.now()).total_seconds())

    return Response({
        "qr_token": str(session.qr_token),
        "remaining_time": remaining
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def end_attendance(request, session_id):
    if request.user.role != "FACULTY":
        return Response({"error": "Unauthorized"}, status=403)

    try:
        session = AttendanceSession.objects.get(id=session_id, faculty=request.user)
    except AttendanceSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)

    session.is_active = False
    session.end_time = timezone.now()
    session.save()

    return Response({"message": "Session ended"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_face(request):
    if request.user.role != "STUDENT":
        return Response({"error": "Only students allowed"}, status=403)

    image_data = request.data.get("image")

    if not image_data:
        return Response({"error": "No image received"}, status=400)

    img_bytes = base64.b64decode(image_data)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    face_locations = face_recognition.face_locations(img)

    if not face_locations:
        return Response({"error": "No face detected"}, status=400)

    encoding = face_recognition.face_encodings(img, face_locations)[0]

    student = StudentProfile.objects.get(user=request.user)
    student.face_encoding = encoding.tolist()
    student.save()

    return Response({"message": "Face registered successfully"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def faculty_attendance_overview(request):
    if request.user.role != "FACULTY":
        return Response({"error": "Unauthorized"}, status=403)

    sessions = AttendanceSession.objects.filter(faculty=request.user)

    total_sessions = sessions.count()

    students = StudentProfile.objects.all()

    data = []

    for student in students:
        attended = AttendanceRecord.objects.filter(
            student=student,
            session__in=sessions,
            face_verified=True
        ).count()

        percentage = 0
        if total_sessions > 0:
            percentage = round((attended / total_sessions) * 100, 2)

        data.append({
            "roll_no": student.roll_no,
            "name": student.user.username,
            "attendance_percentage": percentage
        })

    return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_attendance_summary(request):
    if request.user.role != "STUDENT":
        return Response({"error": "Unauthorized"}, status=403)

    student = StudentProfile.objects.get(user=request.user)

    total_sessions = AttendanceSession.objects.count()

    attended = AttendanceRecord.objects.filter(
        student=student,
        face_verified=True
    ).count()

    percentage = 0
    if total_sessions > 0:
        percentage = round((attended / total_sessions) * 100, 2)

    return Response({
        "total_sessions": total_sessions,
        "attended": attended,
        "attendance_percentage": percentage
    })
