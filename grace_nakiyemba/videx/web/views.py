from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Video
from .forms import VideoUploadForm

def landing(request):
    return render(request, 'web/landing.html')

def video_list(request):
    videos = Video.objects.all()  # Already ordered by -uploaded_at
    return render(request, 'web/video_list.html', {'videos': videos})

def upload_video(request):
    if request.method == 'POST':
        form = VideoUploadForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Video uploaded successfully!')
            return redirect('video_list')
    else:
        form = VideoUploadForm()
    return render(request, 'web/upload.html', {'form': form})

def video_detail(request, pk):
    video = get_object_or_404(Video, pk=pk)
    video.views += 1
    video.save()
    return render(request, 'web/video_detail.html', {'video': video})