from django.urls import path
from . import views

urlpatterns = [

    path("",views.landing_page,name="landing_page"),
    path("videos/",views.video_list,name="video_list"),
    path("videos/add/",views.add_video,name="add_video"),
    path("videos/<int:pk>/",views.watch_video,name="watch_video"),
]