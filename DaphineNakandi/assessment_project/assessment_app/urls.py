from django.urls import path
from . import views
urlpatterns = [
    # Landing page
    path('', views.landing, name='landing'),

    # Upload form
    path('upload/', views.upload_video, name='upload_video'),

    # Video listing page
    path('videos/', views.video_list, name='video_list'),
]