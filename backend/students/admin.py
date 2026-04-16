from django.contrib import admin
from .models import StudentProfile, AcademicRecord
@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('roll_no', 'department', 'year')
    search_fields = ('roll_no', 'user__username')

@admin.register(AcademicRecord)
class AcademicRecordAdmin(admin.ModelAdmin):
    list_display = (
        'student',
        'year',
        'semester',
        'cgpa',
        'verified',
        'uploaded_at'
    )
    list_filter = ('year', 'semester', 'verified')
    search_fields = ('student__roll_no',)
    readonly_fields = ('uploaded_at',)
