from django.urls import path
from .views import student_dashboard,student_list,student_detail,register_face,mark_attendance
from . import views

urlpatterns=[
    path('dashboard/', student_dashboard),
    path('', student_list),
    path('<int:student_id>/', student_detail),
    path('register-face/', register_face),
    path('attendance/mark/', mark_attendance),
     path('attendance/history/', views.student_attendance_history),
    path('attendance/student/<str:roll_no>/', views.faculty_student_attendance),
]