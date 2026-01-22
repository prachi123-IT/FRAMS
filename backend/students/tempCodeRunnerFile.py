from django.shortcuts import render
# from django.http import JsonResponse
# from django.contrib.auth.decorators import login_required
# from .models import StudentProfile

# @login_required
# def student_dashboard(request):
#     if request.user.role != 'STUDENT':
#         return JsonResponse({'error':'Unauthorized'},status=403)
    
#     return JsonResponse({
#         'message':'Welcome Student',
#         'username':request.user.username
#     })

# @login_required
# def student_list(request):
#     if request.user.role != 'FACULTY':
#         return JsonResponse({'error':'Unauthorized'},status=403)
    
#     students=StudentProfile.objects.all()

#     data=[]
#     for s in students:
#         data.append({
#             'id': s.id,
#             'roll_no': s.roll_no,
#             'department': s.department,
#             'year': s.year,
#             'semester': s.semester
#         })

#     return JsonResponse(data, safe=False)

# @login_required
# def student_detail(request, student_id):
#     if request.user.role != 'FACULTY':
#         return JsonResponse({'error':'Unauthorized'},status=403)
    
#     try:
#         s = StudentProfile.objects.get(id=student_id)
#     except StudentProfile.DoesNotExist:
#         return JsonResponse({'error': 'Student not found'}, status=404)
    
#     return JsonResponse({
#         'id': s.id,
#         'roll_no': s.roll_no,
#         'department': s.department,
#         'year': s.year,
#         'semester': s.semester
#     })