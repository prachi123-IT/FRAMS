from django.urls import path
from .views import student_dashboard, upload_marksheet,get_student_profile,save_student_profile,StudentListView,StudentDetailView 

urlpatterns = [
    path('dashboard/', student_dashboard),
    # path('register-face/', register_face),
    path("upload-marksheet/", upload_marksheet),
    # path("verify-face/", verify_face),
    path("profile/", get_student_profile),
    path("profile/save/", save_student_profile),
    path("students/", StudentListView.as_view()),
    path("faculty/student/<str:roll_no>/", StudentDetailView.as_view()),
]
