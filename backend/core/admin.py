from django.contrib import admin
from .models import AppUser, PasswordResetToken,Profile,InterviewQuestion,InterviewAnswer,InterviewSession
# Register your models here.
admin.site.register(AppUser)
admin.site.register(PasswordResetToken)
admin.site.register(Profile)
admin.site.register(InterviewQuestion)
admin.site.register(InterviewAnswer)
admin.site.register(InterviewSession)