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



# core/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import InterviewSession, InterviewQuestion
from .rag.vectorstore import VectorStoreChroma
from .rag.scraper import fetch_online_course_data
from openai import OpenAI
import json
import re
import traceback
# --- Configure OpenRouter client ---
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"  # replace with your key
)

documents = []

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_interview(request):
    user = request.user
    course = request.data.get("course")
    difficulty = request.data.get("difficulty")

    if not course or not difficulty:
        return Response({"error": "course and difficulty required"}, status=400)

    # --- 1. Initialize Chroma vector store ---
    vs = VectorStoreChroma()

    # --- 2. Search existing documents ---
    raw_results = vs.search(query=course, top_k=10, course=course, difficulty=difficulty)
    results = [doc for doc in raw_results if doc.metadata.get("difficulty") == difficulty]
    print("Raw results:", raw_results)

    # --- 3. Fetch online sources if no relevant documents ---
    if not raw_results:
        new_docs, metadatas = fetch_online_course_data(course, difficulty)
        print("New docs:", new_docs)
        print("Metadatas:", metadatas)
        if new_docs:
            vs.build_index(new_docs, metadatas)
            documents.extend([{
                "page_content": doc,
                "metadata": meta
            } for doc, meta in zip(new_docs, metadatas)])

            # Search again after adding
            raw_results = vs.search(query=course, top_k=10, course=course, difficulty=difficulty)
            results = [doc for doc in raw_results if doc.metadata.get("difficulty") == difficulty]

    # --- 4. Prepare context for LLM ---
    context_texts = [doc.page_content for doc in results] if results else ["No relevant documents found."]
    print("Context texts:", context_texts)

    prompt = f"""
Generate interview questions for course: {course}, difficulty: {difficulty}.
Total interview time: 25 minutes.
if diffculty is easy the time and question is in b/w 50 to 90 and if medium then in b/w 70 to 110 and if hard then in b/w 90 to 130
and all question are based on the interview like and consider online and context and generalized course relatedgneralized difult based questions..
all are asking question no will write like only telling interview like question and trick way..and smart interview
Context documents: {context_texts}

Output strictly as JSON array only. Example:
[
  {{"order": 1, "question": "Explain ...", "allocated_time": 120}}
]
"""

    # --- 5. Generate questions via OpenRouter ---
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b:free",  # or "x-ai/grok-4-fast:free" or  "openai/gpt-oss-20b:free" or "deepseek/deepseek-chat-v3.1:free"
            messages=[{"role": "user", "content": prompt}]
        )

        generated_text = response.choices[0].message.content.strip()

        # --- Clean JSON from markdown or extra text ---
        if generated_text.startswith("```"):
            generated_text = re.sub(r"^```[a-zA-Z]*\n", "", generated_text)
            generated_text = generated_text.replace("```", "").strip()

        # Extract JSON array
        match = re.search(r"\[.*\]", generated_text, re.DOTALL)
        if match:
            generated_text = match.group(0)

        # Parse JSON safely
        questions = json.loads(generated_text)

    except json.JSONDecodeError as json_err:
        traceback.print_exc()
        return Response({
            "error": "LLM returned invalid JSON",
            "raw_text": generated_text,
            "details": str(json_err)
        }, status=500)

    except Exception as e:
        traceback.print_exc()
        return Response({
            "error": "Unexpected error during LLM call",
            "details": str(e)
        }, status=500)

    # --- 6. Save session and questions in DB ---
    session = InterviewSession.objects.create(user=user, course=course, difficulty=difficulty)
    for q in questions:
        InterviewQuestion.objects.create(
            session=session,
            question_text=q["question"],
            allocated_time=q["allocated_time"],
            order=q["order"]
        )

    return Response({"session_id": session.id, "questions": questions,"username":"venkat"}, status=201)





'''

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import InterviewSession, InterviewQuestion, InterviewAnswer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answer(request):
    """
    Submits an answer for a specific question within an interview session.

    This function is updated to use both the session_id and order_id
    to correctly identify the question.
    """
    user = request.user

    # Get the required data from the request body
    session_id = request.data.get('session_id')
    order_id = request.data.get('order_id')
    answer_text = request.data.get('answer_text')
    time_taken = request.data.get('time_taken', 0)
    print("session_id:", session_id)
    print("order_id:", order_id)
    print("answer_text:", answer_text)
    print("time_taken:", time_taken)
    # Validate that all necessary fields are provided
    if not all([session_id, order_id, answer_text]):
        return Response({"error": "Missing required fields: session_id, order_id, and answer_text."}, status=400)

    try:
        # First, retrieve the interview session.
        session = get_object_or_404(InterviewSession, id=session_id)
    except Exception:
        return Response({"error": "Invalid session_id."}, status=404)

    # Ensure that the authenticated user owns this session for security.
    if session.user != user:
        return Response({"error": "You are not authorized to submit an answer for this session."}, status=403)

    try:
        # Retrieve the specific question using both the session and the order_id.
        question = get_object_or_404(InterviewQuestion, session=session, order=order_id)
    except Exception:
        return Response({"error": "Question not found for this session and order_id."}, status=404)

    # Use update_or_create to save the answer, linking it to the user and question.
    answer, created = InterviewAnswer.objects.update_or_create(
        question=question,
        user=user,
        defaults={
            "answer_text": answer_text,
            "time_taken": time_taken,
            "submitted_at": timezone.now()
        }
    )

    # Progress tracking logic remains similar.
    total_questions = session.questions.count()
    answered_questions = InterviewAnswer.objects.filter(question__session=session, user=user).count()

    # Mark the session as complete if all questions have been answered.
    if answered_questions == total_questions:
        session.completed = True
        session.save()

    return Response({
        "message": "Answer saved successfully." if created else "Answer updated successfully.",
        "session_id": session.id,
        "answered_questions": answered_questions,
        "total_questions": total_questions,
        "completed": session.completed
    }, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_interview_summary(request):
    """
    Retrieves the interview summary by using the Gemini API.

    This function gets all answers for a session, formats them into a
    prompt, and sends the prompt to the Gemini API to get a summary.
    """
    user = request.user
    session_id = request.data.get('session_id')

    if not session_id:
        return Response({"error": "Missing required field: session_id."}, status=400)

    try:
        session = get_object_or_404(InterviewSession, id=session_id)
    except Exception:
        return Response({"error": "Invalid session_id."}, status=404)

    # Ensure the user has permission to access this session
    if session.user != user:
        return Response({"error": "You are not authorized to view this session summary."}, status=403)

    # Retrieve all answers for the session and sort them by question order
    answers = InterviewAnswer.objects.filter(
        question__session=session,
        user=user
    ).order_by('question__order')
    
    if not answers.exists():
        return Response({"error": "No answers found for this session."}, status=404)

    # Construct the prompt for the Gemini API
    prompt_parts = [
        "You are an AI interviewer. Provide a concise, single-paragraph summary of the user's performance in the mock interview. Do not include a conversational opening or closing.",
        "Here are the interview questions and the user's answers:",
        "" # Newline for readability
    ]
    
    for answer in answers:
        question_text = answer.question.question_text
        answer_text = answer.answer_text
        prompt_parts.append(f"Question: {question_text}")
        prompt_parts.append(f"Answer: {answer_text}")
        prompt_parts.append("")
        
    prompt = "\n".join(prompt_parts)

    # Make the API call to the Gemini model
    # Note: The provided API key is for example purposes. You should use an environment variable in production.
    api_key = "AIzaSyD54U-jTwxNSIlit3Yd33Hu0s0H9PKJuIw"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        response.raise_for_status() # Raise an exception for bad status codes
        
        gemini_response = response.json()
        summary = gemini_response['candidates'][0]['content']['parts'][0]['text']
        
        return Response({"summary": summary}, status=200)
        
    except requests.exceptions.RequestException as e:
        print(f"Error calling Gemini API: {e}")
        return Response({"error": "Failed to get summary from AI due to network or API issue."}, status=500)
    except (KeyError, IndexError) as e:
        print(f"Error parsing Gemini API response: {e}")
        return Response({"error": "Failed to parse AI response."}, status=500)

import io
import numpy as np
from scipy.io import wavfile
import whisper
import librosa
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

# Load Whisper model once at server start
model = whisper.load_model("base")  # small, fast

@csrf_exempt
@require_POST
def transcribe_audio(request):
    """
    Receive WAV audio from React, normalize, convert to mono, resample to 16kHz, 
    and transcribe with Whisper.
    """
    try:
        if "file" not in request.FILES:
            return JsonResponse({"error": "No audio file provided"}, status=400)

        audio_file = request.FILES["file"]
        wav_bytes = audio_file.read()

        # Read WAV
        samplerate, data = wavfile.read(io.BytesIO(wav_bytes))

        # Convert stereo to mono if needed
        if len(data.shape) > 1:
            data = data.mean(axis=1)

        # Convert to float32 [-1.0, 1.0] and normalize
        audio = data.astype(np.float32)
        max_val = np.max(np.abs(audio))
        if max_val > 0:
            audio /= max_val

        # Resample to 16kHz for better Whisper accuracy
        audio_resampled = librosa.resample(audio, orig_sr=samplerate, target_sr=16000)

        # Transcribe
        result = model.transcribe(audio_resampled, language="en")

        return JsonResponse({"transcript": result["text"]})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
'''
import io
import numpy as np
from scipy.io import wavfile
import whisper
import librosa
import requests
import json

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404
# Ensure your models are correctly imported
from .models import InterviewSession, InterviewQuestion, InterviewAnswer

# =========================================================================
# GLOBAL/MODULE-LEVEL WHISPER MODEL
# Loads the Whisper model once when the Django process starts
# =========================================================================
try:
    # Use 'base' for a good balance of speed and accuracy
    whisper_model = whisper.load_model("small") 
except Exception as e:
    print(f"CRITICAL: Failed to load Whisper model: {e}")
    whisper_model = None

def _transcribe_wav_file(audio_file):
    """
    Helper function to transcribe a WAV file using the Whisper model.
    Handles WAV read, mono conversion, normalization, and resampling to 16kHz.
    
    Returns: transcribed text (str) or an error string starting with "ERROR"
    """
    if not whisper_model:
        return "ERROR: Transcription model not loaded on server."

    try:
        # File is a Django UploadedFile, read its bytes
        wav_bytes = audio_file.read()

        samplerate, data = wavfile.read(io.BytesIO(wav_bytes))

        # Convert stereo to mono if needed
        if len(data.shape) > 1:
            data = data.mean(axis=1)

        # Convert to float32 [-1.0, 1.0] and normalize
        audio = data.astype(np.float32)
        max_val = np.max(np.abs(audio))
        if max_val > 0:
            audio /= max_val

        # Resample to 16kHz, which is required for Whisper
        audio_resampled = librosa.resample(audio, orig_sr=samplerate, target_sr=16000)
    
        # Transcribe
        result = whisper_model.transcribe(audio_resampled, language="en")
        print(result["text"])
        return result["text"].strip()

    except Exception as e:
        print(e)
        return f"ERROR: Audio processing failed: {type(e).__name__} - {str(e)}"

# =========================================================================
# SUBMIT ANSWER VIEW (Updated)
# =========================================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answer(request):
    """
    Submits an answer for a specific question.
    Handles both WAV file upload (transcribed by Whisper) and plain text (for skips/errors).
    """
    user = request.user
    session_id = request.data.get('session_id')
    order_id = request.data.get('order_id')
    time_taken = request.data.get('time_taken', 0)
    audio_file = request.FILES.get('answer_audio')
    print("Received data:", request.data)
    
    # 1. Start with the transcript being the text fallback or empty
    final_transcript = request.data.get('answer_text', "").strip()

    # 2. Validate essential data
    if not all([session_id, order_id]):
        return Response({"error": "Missing required fields: session_id and order_id."}, status=400)
    
    # 3. Handle Audio File Transcription
    if audio_file:
        # Only attempt transcription if the file is not empty (a skip/timeout can result in an empty file)
        if audio_file.size > 0:
            transcribed_text = _transcribe_wav_file(audio_file)
            
            # Check for error returned by the transcription helper
            if transcribed_text.startswith("ERROR"):
                final_transcript = transcribed_text
                # Log the error but continue to save the error message in the DB
                print(f"Transcription Error: {final_transcript}")
            else:
                final_transcript = transcribed_text
        else:
            final_transcript = "No audio recorded (empty file submitted)."

    # 4. Handle Text Fallback / Skips
    # If no file was provided and the fallback text is empty, set a default message.
    if not final_transcript:
        final_transcript = "No verbal answer provided (Text fallback used)."
        
    # The final text to be saved in the database
    answer_to_save = final_transcript
    
    # 5. Retrieve and Validate Session/Question
    try:
        session = get_object_or_404(InterviewSession, id=session_id, user=user)
    except Exception:
        return Response({"error": "Invalid session_id or session does not belong to user."}, status=404)

    try:
        # Retrieve the specific question using both the session and the order_id.
        question = get_object_or_404(InterviewQuestion, session=session, order=order_id)
    except Exception:
        return Response({"error": "Question not found for this session and order_id."}, status=404)

    # 6. Save the Answer
    answer, created = InterviewAnswer.objects.update_or_create(
        question=question,
        user=user,
        defaults={
            "answer_text": answer_to_save,
            "time_taken": time_taken,
            "submitted_at": timezone.now()
        }
    )

    # 7. Progress Tracking
    total_questions = session.questions.count()
    answered_questions = InterviewAnswer.objects.filter(question__session=session, user=user).count()

    if answered_questions == total_questions:
        session.completed = True
        session.save()

    # 8. Return the final transcript to the frontend
    return Response({
        "message": "Answer saved and transcribed successfully.",
        "transcript": answer_to_save, # This is the key the frontend expects to display
        "session_id": session.id,
        "answered_questions": answered_questions,
        "total_questions": total_questions,
        "completed": session.completed
    }, status=201)

# =========================================================================
# GET INTERVIEW SUMMARY VIEW (Unchanged, but now using explicit imports)
# =========================================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_interview_summary(request):
    """
    Retrieves the interview summary by using the Gemini API.
    """
    user = request.user
    session_id = request.data.get('session_id')

    if not session_id:
        return Response({"error": "Missing required field: session_id."}, status=400)

    try:
        session = get_object_or_404(InterviewSession, id=session_id)
    except Exception:
        return Response({"error": "Invalid session_id."}, status=404)

    if session.user != user:
        return Response({"error": "You are not authorized to view this session summary."}, status=403)

    answers = InterviewAnswer.objects.filter(
        question__session=session,
        user=user
    ).order_by('question__order')
    
    if not answers.exists():
        return Response({"error": "No answers found for this session."}, status=404)

    prompt_parts = [
        "You are an AI interviewer. Provide a concise, single-paragraph summary of the user's performance in the mock interview. Do not include a conversational opening or closing.",
        "If the user had misspell or any symantical errors in the user response please try to rephrase them and assume the content is related to the interview topic they are in assume in this way...Here are the interview questions and the user's answers: ",
        ""
    ]
    
    for answer in answers:
        # Assuming your question model has 'question_text' field
        question_text = answer.question.question_text if hasattr(answer.question, 'question_text') else answer.question.question
        answer_text = answer.answer_text
        prompt_parts.append(f"Question: {question_text}")
        prompt_parts.append(f"Answer: {answer_text}")
        prompt_parts.append("")
        
    prompt = "\n".join(prompt_parts)

    api_key = "AIzaSyD54U-jTwxNSIlit3Yd33Hu0s0H9PKJuIw"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()
        
        gemini_response = response.json()
        summary = gemini_response['candidates'][0]['content']['parts'][0]['text']
        
        return Response({"summary": summary}, status=200)
        
    except requests.exceptions.RequestException as e:
        print(f"Error calling Gemini API: {e}")
        return Response({"error": "Failed to get summary from AI due to network or API issue."}, status=500)
    except (KeyError, IndexError) as e:
        print(f"Error parsing Gemini API response: {e}")
        return Response({"error": "Failed to parse AI response."}, status=500)

# NOTE: The original 'transcribe_audio' view has been removed as its functionality is now 
# integrated directly into 'submit_answer' via the '_transcribe_wav_file' helper function.
'''
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import fitz  # PyMuPDF
import requests
import os
from django.conf import settings
from django.core.files.storage import default_storage

# Helper: extract resume details
def extract_resume_details(pdf_path):
    doc = fitz.open(pdf_path)
    resume_data = {"pages": []}

    for page_num, page in enumerate(doc, start=1):
        page_data = {"page_number": page_num, "text": [], "images": []}
        blocks = page.get_text("dict")["blocks"]
        for b in blocks:
            if "lines" in b:
                for line in b["lines"]:
                    for span in line["spans"]:
                        page_data["text"].append({
                            "text": span["text"],
                            "font": span["font"],
                            "size": span["size"],
                            "color": span["color"],
                            "bbox": span["bbox"]
                        })
        # Extract images
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            image_filename = f"page{page_num}_img{img_index}.{image_ext}"
            save_path = os.path.join(settings.MEDIA_ROOT, image_filename)
            with open(save_path, "wb") as f:
                f.write(image_bytes)
            page_data["images"].append(settings.MEDIA_URL + image_filename)
        resume_data["pages"].append(page_data)
    return resume_data

# Helper: call Gemini API
def analyze_resume_gemini(resume_data, role=None, experience=None):
    text_content = "\n".join([span["text"] for page in resume_data["pages"] for span in page["text"]])

    prompt = f"""
You are an expert career coach and interviewer.
Candidate applying for role: {role or 'General'}.
Experience level: {experience or 'Not specified'}.
Here is the resume content:

{text_content}

Please provide a detailed analysis:
1. Summary of candidate profile
2. Key strengths
3. Weaknesses / negatives
4. Missing skills/technologies
5. Suggestions to improve resume formatting
6. Areas where interviewers will likely focus
7. Skill gaps the candidate should work on
8. Any ATS (Applicant Tracking System) issues
9. Recommendations for template, layout, and readability
Format as JSON with keys: summary, strengths, weaknesses, missing_skills, formatting_suggestions, interview_focus, skill_gaps, ATS_issues, template_suggestions
"""

    api_key = "AIzaSyD54U-jTwxNSIlit3Yd33Hu0s0H9PKJuIw"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        data = response.json()
        content = data.get("candidates", [{}])[0].get("content", "")
        try:
            return json.loads(content)  # Expecting JSON format from prompt
        except:
            return {"analysis_text": content}  # fallback
    else:
        return {"error": response.text, "status_code": response.status_code}

# Main API
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resume_analysis(request):
    role = request.data.get("role")
    experience = request.data.get("experience")
    resume_file = request.FILES.get("resume")

    if not resume_file or not resume_file.name.endswith('.pdf'):
        return Response({"error": "Please upload a PDF file."}, status=400)

    # Save file temporarily
    temp_path = default_storage.save(f"temp/{resume_file.name}", resume_file)
    abs_path = os.path.join(settings.MEDIA_ROOT, temp_path)

    try:
        resume_data = extract_resume_details(abs_path)
        analysis = analyze_resume_gemini(resume_data, role, experience)
    finally:
        if os.path.exists(abs_path):
            os.remove(abs_path)
    print("resume_data:\n", resume_data)
    print("analysis:\n", analysis)
    return Response({"resume_data": resume_data, "analysis": analysis})'''

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import fitz # PyMuPDF
import requests
import os
import json
from django.conf import settings
from django.core.files.storage import default_storage


# Helper: extract resume details
def extract_resume_details(pdf_path):
    doc = fitz.open(pdf_path)
    resume_data = {"pages": []}

    for page_num, page in enumerate(doc, start=1):
        page_data = {"page_number": page_num, "text": [], "images": []}
        blocks = page.get_text("dict")["blocks"]
        for b in blocks:
            if "lines" in b:
                for line in b["lines"]:
                    for span in line["spans"]:
                        page_data["text"].append({
                            "text": span["text"],
                            "font": span["font"],
                            "size": span["size"],
                            "color": span["color"],
                            "bbox": span["bbox"]
                        })
        resume_data["pages"].append(page_data)
    return resume_data


# Helper: call Gemini API (UPDATED for Scoring and Cleaned Whitespace)
def analyze_resume_gemini(resume_data, role=None, experience=None):
    text_content = "\n".join([
        span["text"] for page in resume_data["pages"] for span in page["text"]
    ])

    # Added instruction to calculate a score and included it in the expected JSON format
    prompt = f"""
You are an expert career coach and interviewer.
Candidate applying for role: {role or 'General'}.
Experience level: {experience or 'Not specified'}.
Here is the resume content:

{text_content}

Please provide a detailed analysis:
1. Summary of candidate profile
2. Key strengths
3. Weaknesses / negatives
4. Missing skills/technologies
5. Suggestions to improve resume formatting
6. Areas where interviewers will likely focus
7. Skill gaps the candidate should work on
8. Any ATS (Applicant Tracking System) issues
9. Recommendations for template, layout, and readability
10. **Calculate an Overall Resume Score from 0 to 100** ats based score base give and +ve bases based on the criteria for the specified role and experience level, focusing on relevance, completeness, and quality here consider all things and it elgigble a better stable overall score giv it may same if same resume comes in n  number of times means here consider all +ve and -ve can give score not always focus on -ve ,balance the -ve and +ve and a bettera cucurate ats like resume score give.

Format as JSON with keys:
**score** (integer from 0-100), summary, strengths, weaknesses, missing_skills, formatting_suggestions,
interview_focus, skill_gaps, ATS_issues, template_suggestions
"""

    api_key = "AIzaSyD54U-jTwxNSIlit3Yd33Hu0s0H9PKJuIw" # ⚠️ Replace with secure key
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={api_key}"

    headers = {"Content-Type": "application/json"}
    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        data = response.json()
        content_text = (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "")
        )

        try:
            # Cleaned logic and fixed indentation
            cleaned_text = (
                content_text.strip()
                .replace("```json", "")
                .replace("```", "")
            )
            analysis_data = json.loads(cleaned_text)
            
            # Ensure the score is cast to an integer
            if 'score' in analysis_data and analysis_data['score'] is not None:
                analysis_data['score'] = int(analysis_data['score'])
                
            return analysis_data
        except json.JSONDecodeError:
            # Fixed indentation for proper exception handling
            return {"analysis_text": content_text}
    else:
        return {"error": response.text, "status_code": response.status_code}


# Main API (UPDATED for Scoring)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def resume_analysis(request):
    role = request.data.get("role")
    experience = request.data.get("experience")
    resume_file = request.FILES.get("resume")

    if not resume_file:
        return Response({"error": "Please upload a resume file."}, status=400)

    if not (
        resume_file.name.endswith(".pdf")
        or resume_file.name.endswith(".docx")
        or resume_file.name.endswith(".doc")
    ):
        return Response(
            {"error": "Unsupported file type. Please upload a PDF, DOC, or DOCX file."},
            status=400,
        )

    # Save temporarily
    temp_path = default_storage.save(f"temp/{resume_file.name}", resume_file)
    abs_path = os.path.join(settings.MEDIA_ROOT, temp_path)

    try:
        # Extract text
        if not resume_file.name.endswith(".pdf"):
            resume_data = {
                "pages": [
                    {
                        "text": [
                            {"text": "File content could not be extracted directly (non-PDF)."},
                            {"text": f"Filename: {resume_file.name}"},
                        ]
                    }
                ]
            }
        else:
            resume_data = extract_resume_details(abs_path)

        # Analyze via Gemini
        analysis = analyze_resume_gemini(resume_data, role, experience)

    finally:
        # Clean up temporary file
        if os.path.exists(abs_path):
            os.remove(abs_path)

    final_response = {
        "status": "success",
        "job_details": {
            "role": role,
            "experience_level": experience,
        },
        "extracted_resume_data": {
            "text_and_format_details": resume_data["pages"]
        },
        "gemini_analysis": {
            # Added the dynamic score from the analysis
            "score": analysis.get("score"), 
            "summary": analysis.get("summary"),
            "strengths": analysis.get("strengths"),
            "weaknesses": analysis.get("weaknesses"),
            "missing_skills": analysis.get("missing_skills"),
            "formatting_suggestions": analysis.get("formatting_suggestions"),
            "interview_focus_areas": analysis.get("interview_focus"),
            "skill_gaps": analysis.get("skill_gaps"),
            "ats_issues": analysis.get("ATS_issues"),
            "template_recommendations": analysis.get("template_suggestions"),
            "analysis_error": analysis.get("error"),
            "raw_analysis_text_fallback": analysis.get("analysis_text"),
        },
    }

    if final_response["gemini_analysis"]["analysis_error"]:
        status_code = final_response["gemini_analysis"].get("status_code", 500)
        final_response["status"] = "analysis_failed"
        return Response(final_response, status=status_code)

    return Response(final_response, status=200)