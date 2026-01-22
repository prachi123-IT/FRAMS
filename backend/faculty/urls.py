from django.urls import path
from .views import (
    faculty_dashboard,
    student_list_view,
    student_academic_view
)
urlpatterns=[
    path('dashboard/', faculty_dashboard),
    path('students/', student_list_view),
    path('student/<str:roll_no>/', student_academic_view),
]