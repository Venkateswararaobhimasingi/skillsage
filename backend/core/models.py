from django.db import models

# Create your models here.
from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class AppUser(AbstractUser):
    email = models.EmailField(unique=True)
    login_method = models.CharField(max_length=20, choices=[('email', 'Email'), ('google', 'Google')], default='email')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Still needed for admin panel

# core/models.py
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid

User = get_user_model()

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timezone.timedelta(hours=1)

    def __str__(self):
        return f"{self.user.email} - {self.token}"
from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    phone = models.CharField(max_length=20, blank=True, default="")
    location = models.CharField(max_length=100, blank=True, default="Not specified")
    title = models.CharField(max_length=100, blank=True, default="Not specified")
    experience = models.CharField(max_length=50, blank=True, default="0 years")
    profile_image = models.URLField(blank=True,null=True,default="https://i.imgur.com/7suwDp5.jpeg")

    def __str__(self):
        return f"{self.user.email}'s Profile"

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        instance.profile.save()



# models.py
from django.db import models


class InterviewSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=50, choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')])
    total_duration = models.IntegerField(default=25)  # in minutes
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.course} ({self.difficulty})"


class InterviewQuestion(models.Model):
    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()
    allocated_time = models.IntegerField()  # seconds per question
    order = models.IntegerField()

    def __str__(self):
        return f"Q{self.order} - {self.question_text[:50]}"


class InterviewAnswer(models.Model):
    question = models.ForeignKey(InterviewQuestion, on_delete=models.CASCADE, related_name="answers")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    answer_text = models.TextField()
    time_taken = models.IntegerField()  # seconds
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer by {self.user.username} for {self.question.id}"
