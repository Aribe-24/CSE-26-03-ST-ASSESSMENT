from django.urls import path
from . import views


from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),                    # Index page
    path('home/', views.home, name='home'),                # Home page with video list
    path('upload/', views.upload_video, name='upload_video'),  # Upload video page
    path('video/', views.video_page, name='video_page'),    # Video page (video.html)
]