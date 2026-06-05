from django.urls import path
from . import views

urlpatterns = [
    path("list/", views.video_list, name="video_list"),
    path("upload/", views.video_upload, name="video_upload"),
    path("video/<int:pk>/", views.video_detail, name="video_detail"),
]