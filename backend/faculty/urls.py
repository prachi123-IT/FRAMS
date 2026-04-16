from django.urls import path
from .views import (
    faculty_dashboard,
    student_list_view,
    student_academic_view,
    verify_academic_record,
    attendance_graph_view,
    attendance_by_day
)
urlpatterns=[
    path('dashboard/', faculty_dashboard),
    path('students/', student_list_view),
    path('student/<str:roll_no>/', student_academic_view),
    path("verify-record/<int:record_id>/", verify_academic_record),
    path("attendance/graph/", attendance_graph_view),
    path("attendance/day/<str:date>/", attendance_by_day),
]