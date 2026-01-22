from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from students.models import StudentProfile,AcademicRecord

@login_required
def faculty_dashboard(request):
    if request.user.role!='FACULTY':
        return JsonResponse({'error':'unauthorized'}, status=403)
    
    return JsonResponse({
        'message':'Welcome Faculty',
        'username':request.user.username
    })

@login_required
def student_list_view(request):
    if request.user.role!='FACULTY':
        return JsonResponse({'error':'unauthorized'}, status=403)
    
    students=StudentProfile.objects.all()

    data=[]
    for s in students:
        data.append({
            "roll_no":s.roll_no,
            "name":s.name,
            "department":s.department,
            "year":s.year
        })
    return JsonResponse({"students":data})

@login_required
def student_academic_view(request,roll_no):
    if request.user.role!='FACULTY':
        return JsonResponse({'error':'unauthorized'}, status=403)
    
    try:
        student=StudentProfile.objects.get(roll_no=roll_no)
    except student.DoesNotExist:
        return JsonResponse({'error':'Student Not Found'}, status=404)

    records = AcademicRecord.objects.filter(student=student)

    academic_data = []
    for r in records:
        academic_data.append({
            "semester": r.semester,
            "subject": r.subject,
            "marks": r.marks
        })

    return JsonResponse({
        "roll_no": student.roll_no,
        "name": student.name,
        "academics": academic_data
    })    

