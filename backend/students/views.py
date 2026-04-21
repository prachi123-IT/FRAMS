import base64
from django.http import JsonResponse
from .models import StudentProfile ,AcademicRecord
from students.services.face_utils import detect_blink
from attendance.utils import calculate_attendance_percentage
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import StudentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import StudentProfile


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def student_dashboard(request):
    if request.user.role != 'STUDENT':
        return JsonResponse({'error':'Unauthorized'},status=403)

    try:
        student = StudentProfile.objects.get(user=request.user)
    except StudentProfile.DoesNotExist:
        return JsonResponse({
        "profile_exists": False,
        "message": "Please complete your profile"
    }, status=200)
    attendance_percentage=calculate_attendance_percentage(student)
    records=AcademicRecord.objects.filter(student=student).order_by("year","semester")
    
    academics = []
    for r in records:
        academics.append({
            "year": r.year,
            "semester": r.semester,
            "cgpa": r.cgpa,
            "verified": r.verified
        })

    return JsonResponse({
        "roll_no": student.roll_no,
        "department": student.department,
        "year": student.year,
        "attendance_percentage": attendance_percentage,
        "academics": academics
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
        })

    return JsonResponse(data, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_face(request):
    import cv2
    import numpy as np
    import face_recognition

    # your existing code here
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)

    if request.user.role != 'STUDENT':
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    image_data = request.data.get('image')
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

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_marksheet(request):

    student = StudentProfile.objects.get(user=request.user)

    semester = request.POST.get("semester")
    cgpa = request.POST.get("cgpa")
    year = request.POST.get("year")

    if not semester or not year:
        return Response({"error": "Year and Semester required"}, status=400)

    record, created = AcademicRecord.objects.get_or_create(
        student=student,
        year=year,
        semester=semester
    )

    if cgpa:
        record.cgpa = cgpa

    if request.FILES.get("marksheet"):
        record.marksheet = request.FILES.get("marksheet")

    record.verified = False   
    record.save()

    return Response({"message": "Semester data saved"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_face(request):
    import cv2
    import numpy as np
    import face_recognition
    if request.user.role != "STUDENT":
        return JsonResponse({"error": "Unauthorized"}, status=403)

    image_data = request.data.get('image')
    if not image_data:
        return JsonResponse({'error': 'No image'}, status=400)

    img_bytes = base64.b64decode(image_data)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    student = StudentProfile.objects.get(user=request.user)

    if not student.face_encoding:
        return JsonResponse({"error": "Face not registered"}, status=400)

    face_locations = face_recognition.face_locations(img)
    if not face_locations:
        return JsonResponse({"error": "No face detected"}, status=400)

    encoding = face_recognition.face_encodings(img, face_locations)[0]

    known = np.array(student.face_encoding)
    match = face_recognition.compare_faces([known], encoding)[0]

    if not match:
        return JsonResponse({"error": "Face not matched"}, status=403)

    return JsonResponse({"message": "Face verified"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_student_profile(request):
    if request.user.role != "STUDENT":
        return JsonResponse({"error": "Unauthorized"}, status=403)

    try:
        student = StudentProfile.objects.get(user=request.user)
    except StudentProfile.DoesNotExist:
        return JsonResponse({"profile_exists": False})

    semesters = AcademicRecord.objects.filter(student=student).order_by("semester")

    semester_data = []
    for sem in semesters:
        semester_data.append({
           "semester": sem.semester,
           "cgpa": sem.cgpa,
           "verified": sem.verified if hasattr(sem, "verified") else True,
           "marksheet": sem.marksheet.url if sem.marksheet else None
    })

    return JsonResponse({
    "profile_exists": True,
    "name": student.name,
    "roll_no": student.roll_no,
    "department": student.department,
    "year": student.year,
    "semester": student.semester,
    "academics": semester_data
})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_student_profile(request):
    if request.user.role != "STUDENT":
        return JsonResponse({"error": "Unauthorized"}, status=403)

    roll_no = request.data.get("roll_no")

    # Check if roll number already exists for another user
    existing = StudentProfile.objects.filter(roll_no=roll_no).exclude(user=request.user).first()
    if existing:
        return JsonResponse({
            "error": "Roll number already exists"
        }, status=400)

    try:
        profile = StudentProfile.objects.get(user=request.user)
        created = False
    except StudentProfile.DoesNotExist:
        profile = StudentProfile(user=request.user)
        created = True

    profile.name = request.data.get("name")
    profile.roll_no = roll_no
    profile.department = request.data.get("department")
    profile.semester = request.data.get("semester")
    profile.year = request.data.get("year")
 


    profile.save()

    return JsonResponse({
        "message": "Profile saved successfully",
        "created": created
    })

class StudentListView(APIView):

    def get(self, request):
        year = request.GET.get("year")
        semester = request.GET.get("semester")
        department = request.GET.get("department")

        students = StudentProfile.objects.all()

        if year and year.isdigit():
            students = students.filter(year=int(year))
            print("Year:", year)

        if semester and semester.isdigit():
            students = students.filter(semester=int(semester))
            print("Semester:", semester)

        if department:
            students = students.filter(department__iexact=department)
            print("Department:", department)

        print("Total Students Before Filter:", StudentProfile.objects.count())
        print("Filtered Count:", students.count())    

       
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)
    
   
    
class StudentDetailView(APIView):

    def get(self, request, roll_no):
        try:
            student = StudentProfile.objects.get(roll_no=roll_no)
        except StudentProfile.DoesNotExist:
            return Response({"error": "Student not found"}, status=404)

        semesters = AcademicRecord.objects.filter(student=student).order_by("semester")

        semester_data = []

        for sem in semesters:
            semester_data.append({
                "semester": sem.semester,
                "cgpa": sem.cgpa,
                "verified": sem.verified,
                "marksheet": sem.marksheet.url if sem.marksheet else None
            })

        return Response({
            "name": student.name,
            "roll_no": student.roll_no,
            "department": student.department,
            "year": student.year,
            "semester": student.semester,
            "face_registered": bool(student.face_encoding),
            "academics": semester_data
       }) 