from django.contrib import admin
from .models import AppUser, PasswordResetToken,Profile
# Register your models here.
admin.site.register(AppUser)
admin.site.register(PasswordResetToken)
admin.site.register(Profile)