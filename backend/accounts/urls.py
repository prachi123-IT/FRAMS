from django.urls import path
from .views import login_view,register_student

urlpatterns=[
    path('login/',login_view, name='login'),
    path("register/student/", register_student),
]