from django.urls import path
from videx_app import views

urlpatterns = [
    path('', views.landing_page_view, name='landing_page'),
    path('home/', views.home, name='home'),
    path('add_video/', views.add_video, name='add_video'),
    path('upload/', views.upload, name='upload'), 
]