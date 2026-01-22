import base64
import cv2
import numpy as np
import face_recognition
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import StudentProfile, Attendance
from django.views.decorators.csrf import csrf_exempt
from students.services.face_utils import detect_blink
from django.utils import timezone
from attendance.models import AttendanceSession

@login_required
def student_dashboard(request):
    if request.user.role != 'STUDENT':
        return JsonResponse({'error':'Unauthorized'},status=403)
    
    return JsonResponse({
        'message':'Welcome Student',
        'username':request.user.username
    })

@login_required
def student_list(request):
    if request.user.role != 'FACULTY':
        return JsonResponse({'error':'Unauthorized'},status=403)
    
    students=StudentProfile.objects.all()

    data=[]
    for s in students:
        data.append({
            'id': s.id,
            'roll_no': s.roll_no,
            'department': s.department,
            'year': s.year,
            'semester': s.semester
        })

    return JsonResponse(data, safe=False)

@login_required
def student_detail(request, student_id):
    if request.user.role != 'FACULTY':
        return JsonResponse({'error':'Unauthorized'},status=403)
    
    try:
        s = StudentProfile.objects.get(id=student_id)
    except StudentProfile.DoesNotExist:
        return JsonResponse({'error': 'Student not found'}, status=404)
    
    return JsonResponse({
        'id': s.id,
        'roll_no': s.roll_no,
        'department': s.department,
        'year': s.year,
        'semester': s.semester
    })

@csrf_exempt
@login_required
def register_face(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)

    if request.user.role != 'STUDENT':
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    image_data = request.POST.get('image')
    if not image_data:
        return JsonResponse({'error': 'No image provided'}, status=400)

    #  Decode image
    img_bytes = base64.b64decode(image_data)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        return JsonResponse({'error': 'Invalid image'}, status=400)

    # Face detection
    face_locations = face_recognition.face_locations(img)
    if len(face_locations) != 1:
        return JsonResponse({'error': 'Exactly one face required'}, status=400)

    # Liveness — face size
    top, right, bottom, left = face_locations[0]
    face_area = (right - left) * (bottom - top)

    if face_area < 5000:
        return JsonResponse({'error': 'Face too far from camera'}, status=400)

    #  Liveness — eye presence
    landmarks = face_recognition.face_landmarks(img)
    if not landmarks:
        return JsonResponse({'error': 'No facial landmarks'}, status=400)

    #  Liveness — BLINK
    if not detect_blink(img):
        return JsonResponse({'error': 'Please blink to verify liveness'}, status=400)

    # Encode face
    encoding = face_recognition.face_encodings(img, face_locations)[0]

    #  Save encoding
    student = StudentProfile.objects.get(user=request.user)
    student.face_encoding = encoding.tolist()
    student.save()

    return JsonResponse({
        'message': 'Face registered successfully'
    })

@csrf_exempt
@login_required
def mark_attendance(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)

    if request.user.role != 'STUDENT':
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    #  STEP 1: Check active attendance session (ADD HERE)
    session = AttendanceSession.objects.filter(is_active=True).first()
    if not session:
        return JsonResponse({
            "error": "No active attendance session"
        }, status=403)

    #  STEP 2: Get image
    image_data = request.POST.get('image')
    if not image_data:
        return JsonResponse({'error': 'No image provided'}, status=400)

    #  STEP 3: Decode image
    try:
        img_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    except Exception:
        return JsonResponse({"error": "Invalid image"}, status=400)

    if img is None:
        return JsonResponse({'error': 'Invalid image'}, status=400)

    #  STEP 4: Detect face
    face_locations = face_recognition.face_locations(img)
    if len(face_locations) != 1:
        return JsonResponse({'error': 'Exactly one face required'}, status=400)

    face_encoding = face_recognition.face_encodings(img, face_locations)[0]

    #  STEP 5: Load stored face encoding
    student = StudentProfile.objects.get(user=request.user)

    if not student.face_encoding:
        return JsonResponse({'error': 'Face not registered'}, status=400)

    stored_encoding = np.array(eval(student.face_encoding))

    #  STEP 6: Compare faces
    matches = face_recognition.compare_faces(
        [stored_encoding], face_encoding, tolerance=0.45
    )

    if not matches[0]:
        return JsonResponse({'error': 'Face mismatch'}, status=403)

    #  STEP 7: Mark attendance
    today = timezone.now().date()

    attendance, created = Attendance.objects.get_or_create(
        student=student,
        date=today
    )

    if not created:
        return JsonResponse({
            "message": "Attendance already marked",
            "date": str(today)
        })

    attendance.status = True
    attendance.save()

    return JsonResponse({
        'message': 'Attendance marked successfully',
        'date': str(today)
    })

@login_required
def student_attendance_history(request):
    if request.user.role!='STUDENT':
        return JsonResponse({'error':'Unauthorized'},status=403)
    
    student=StudentProfile.objects.get(user=request.user)

    records=Attendance.objects.filter(student=student).order_by('-date')
    data=[]
    for r in records:
        data.append({
            'date':r.date,
            'status':r.status
        })

    return JsonResponse({
        'student':student.roll_no,
        'attendance':data
    })

@login_required
def faculty_student_attendance(request, roll_no):
    if request.user.role not in ['FACULTY','ADMIN']:
        return JsonResponse({'error':'Unauthorized'},status=403)
    
    try:
        student=StudentProfile.objects.get(roll_no=roll_no)
    except StudentProfile.DoesNotExist:
        return JsonResponse({'error':'Student Not Found'},status=404)

    records = Attendance.objects.filter(student=student).order_by('-date')

    data = []
    for r in records:
        data.append({
            'date': r.date,
            'status': r.status
        })

    return JsonResponse({
        'student': student.roll_no,
        'attendance': data
    })    



