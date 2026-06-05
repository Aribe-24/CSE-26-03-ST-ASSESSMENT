from django.urls import path
from . import views

urlpatterns = [

    path('', views.landing, name='landing'),
    path('videos/',views.video_list,name='video_list'),
    path('upload/',views.upload_video,name='upload_video'),
]