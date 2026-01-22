from django.urls import path
from .views import start_attendance, mark_attendance, attendance_history

urlpatterns = [
    path('start/', start_attendance),
    path('mark/<uuid:qr_token>/', mark_attendance),
    path('history/', attendance_history),
]