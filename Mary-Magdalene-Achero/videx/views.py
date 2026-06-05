from django.shortcuts import render, redirect, get_object_or_404
from .forms import VideoForm
from .models import Video
from django.contrib import messages

def index(request):
    return render(request, "index.html")

def video_upload(request):
    if request.method == "POST":
        form = VideoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, "Video uploaded successfully!")
            return redirect("video_upload")
    else:
        form = VideoForm()

    return render(request, "video_upload.html", {"form": form})

def video_list(request):
    videos = Video.objects.all().order_by("-created_at")
    return render(request, "video_list.html", {"videos": videos})

def video_detail(request, pk):
    video = get_object_or_404(Video, pk=pk)
    return render(request, "video_detail.html", {"video": video})