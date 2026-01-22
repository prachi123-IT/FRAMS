from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def login_view(request):
    if request.method=='POST':
        data=json.loads(request.body)
        username=data.get('username')
        password=data.get('password')

        user=authenticate(username=username, password=password)

        if user:
            login(request,user)
            return JsonResponse({
                'message':'Login Successful',
                'role':user.role
            })
        return JsonResponse({'error':'Invalid Credentials'}, status=401)
    
    return JsonResponse(
        {"error": "Only POST method allowed"},
        status=405
    )

