from django.urls import path
from .views import start_attendance, verify_qr, mark_attendance_face,check_qr_session,live_qr,end_attendance,register_face,faculty_attendance_overview,student_attendance_summary
urlpatterns = [
    path("start/", start_attendance),
    path("end/<int:session_id>/", end_attendance),
    path("verify-qr/<uuid:qr_token>/", verify_qr),
    path("mark-face/<int:session_id>/", mark_attendance_face),
    path("check/<uuid:qr_token>/", check_qr_session),
    path("live-qr/<int:session_id>/", live_qr),
    path("register-face/", register_face),
    path("faculty-overview/", faculty_attendance_overview),
   path("student-summary/", student_attendance_summary),
]
