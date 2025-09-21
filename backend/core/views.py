from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from google.oauth2 import id_token
from google.auth.transport import requests
from .models import AppUser
from rest_framework.authtoken.models import Token
from django.conf import settings

class GoogleLoginAPIView(APIView):
    def post(self, request):
        token = request.data.get('token')
        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)
            email = idinfo['email']
            name = idinfo.get('name', 'No Name')
            user, created = AppUser.objects.get_or_create(email=email, defaults={
                'username': email.split('@')[0],
                'login_method': 'google',
            })
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user': {'email': user.email, 'name': name}})
        except ValueError:
            return Response({'error': 'Invalid token'}, status=400)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "User created successfully",
                "redirect_url": "http://localhost:5173/dashboard"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomLoginView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer
# core/views.py


from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from .models import PasswordResetToken
import json

User = get_user_model()

@csrf_exempt
def request_password_reset(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Only POST allowed"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")
    except:
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    if not email:
        return JsonResponse({"detail": "Email is required"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"detail": "If user exists, email will be sent."}, status=200)

    token_obj = PasswordResetToken.objects.create(user=user)
    reset_link = f"http://127.0.0.1:8000/password-reset-confirm/{token_obj.token}/"

    # Send email
    send_mail(
        subject="Reset Your Password – SkillSageAi",
        message=f"""
Hello from SkillSageAi!

You're receiving this email because you (or someone else) requested a password reset for your account.

If you did not request this, you can safely ignore this email.

To reset your password, click the link below:

{reset_link}

This link will expire in 1 hour for your security.

Thanks,
The SkillSageAi Team
""",
        from_email="no-reply@example.com",
        recipient_list=[user.email],
        fail_silently=False,
    )

    return JsonResponse({"detail": "If user exists, email will be sent."}, status=200)



from django.utils import timezone
from django.contrib.auth.hashers import make_password

def clean_expired_tokens():
    expired_tokens = PasswordResetToken.objects.all()
    deleted_count = 0

    for token in expired_tokens:
        if token.is_expired():
            token.delete()
            deleted_count += 1

    return deleted_count
 
def password_reset_confirm(request, token):
    try:
        count1= clean_expired_tokens()
        print(f"Cleaned {count1} expired tokens.")
        reset_token = PasswordResetToken.objects.get(token=token)
    except PasswordResetToken.DoesNotExist:
        return render(request, "core/password_reset_form.html", {"error": "Invalid reset link."})

    if reset_token.is_expired():
        reset_token.delete()
        return render(request, "core/password_reset_form.html", {"error": "Link expired. Please request again."})

    if request.method == "POST":
        password1 = request.POST.get("new_password1")
        password2 = request.POST.get("new_password2")

        if not password1 or not password2:
            return render(request, "core/password_reset_form.html", {"error": "Both fields are required."})

        if password1 != password2:
            return render(request, "core/password_reset_form.html", {"error": "Passwords do not match."})

        reset_token.user.password = make_password(password1)
        reset_token.user.save()
        reset_token.delete()

        return redirect("http://localhost:5173/login")

    return render(request, "core/password_reset_form.html")

from rest_framework.permissions import IsAuthenticated

class SomeProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"data": "secret data"})

# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)



# views.py
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import redirect

def google_login_token_view(request):
    user = request.user
    if user.is_authenticated:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        # Pass the tokens to frontend via URL
        frontend_url = f"http://localhost:5173/google-auth?access={access_token}&refresh={refresh_token}"
        return redirect(frontend_url)
    return redirect("http://localhost:5173/login")

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })

# profiles/views.py
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveUpdateAPIView
from .models import Profile
from .serializers import ProfileSerializer
from django.views.decorators.csrf import csrf_exempt

class ProfileView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user.profile

from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


import requests
from django.conf import settings
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Profile
from .serializers import ProfileSerializer
 # our helper function

import requests
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def upload_to_imgur(image_file):
    """
    Uploads an image file to Imgur and returns the public URL.
    """
    url = "https://api.imgur.com/3/image"
    headers = {
        "Authorization": f"Client-ID {settings.IMGUR_CLIENT_ID}"
    }

    try:
        # Upload image to Imgur
        response = requests.post(url, headers=headers, files={"image": image_file})
        print(response.status_code)
        response.raise_for_status()  # Will raise an HTTPError if the status code is not 2xx

        # Parse the response
        response_data = response.json()
        print(response_data)
        if response_data.get('success'):
            return response_data['data']['link']  # Return the public image URL
        else:
            raise Exception("Imgur API response indicates failure.")
    
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to upload image to Imgur: {str(e)}")




class UploadProfilePictureView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file = request.FILES.get("image")
        if not file:
            return Response({"error": "No image uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            profile, _ = Profile.objects.get_or_create(user=request.user)
            imgur_url = upload_to_imgur(file)
            profile.profile_image = imgur_url
            profile.save()

            return Response({"profile_image": imgur_url}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_email(request):
    return Response({
        "email": request.user.email,
        "login_method": request.user.login_method
    })
