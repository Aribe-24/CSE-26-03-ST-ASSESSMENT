from django.contrib import messages
from django.shortcuts import redirect, render
from django.shortcuts import render, get_object_or_404
from .models import Video, Comment, Like
from videx_app import vidform
# Create your views here.

def landing_page_view(request):
    return render(request, 'landing_page.html')

def home(request):
    videos = Video.objects.all()
    return render(request, 'home.html', {'videos': videos})

def add_video(request):
    if request.method == 'POST':
        form = vidform.VideoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('home')
        messages.success(request, 'Your video has been uploaded successfully!') 
    return render(request, 'add_video.html')
def upload(request):
    if request.method == 'POST':
        form = vidform.VideoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
        messages.success(request, 'Your video has been uploaded successfully!')
        return redirect('home')  # 
    else:
        # If GET request, maybe render the form
        return render(request, 'add_video.html')