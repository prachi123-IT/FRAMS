from rest_framework import serializers
from .models import StudentProfile

class StudentSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentProfile
        fields = [
            "id",
            "name",
            "roll_no",
            "department",
            "year",
            "semester",
        ]