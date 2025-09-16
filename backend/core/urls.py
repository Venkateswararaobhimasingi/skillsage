from django.urls import path
from .views import GoogleLoginAPIView
from .views import RegisterView,ProfileView
from . import views
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('google-login/', GoogleLoginAPIView.as_view()),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', views.CustomLoginView.as_view(), name='token_obtain_pair'),
    path('password-reset/', views.request_password_reset, name='request_password_reset'),
    path('password-reset-confirm/<uuid:token>/', views.password_reset_confirm, name='password_reset_confirm'),
    path('google/token/',views.google_login_token_view, name='google_login_token_view'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('me/', views.CurrentUserView.as_view(), name='current-user'),
    path("profile/", ProfileView.as_view(), name="profile"),
    path('token_resfresh/',views.get_tokens_for_user, name='get_tokens_for_user'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("upload-profile-picture/", views.UploadProfilePictureView.as_view(), name="upload-profile-picture"),




]