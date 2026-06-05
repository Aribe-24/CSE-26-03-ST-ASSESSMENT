from django.contrib import messages
from django.shortcuts import redirect, render

from .forms import VideoForm
from .models import Video


def landing(request):
    return render(request, 'landing.html')


def video_list(request):
    videos = Video.objects.all()
    return render(request, 'video_list.html', {'videos': videos})


def upload_video(request):
    if request.method == 'POST':
        form = VideoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Video uploaded successfully.')
            return redirect('video_list')
    else:
        form = VideoForm()

    return render(request, 'upload.html', {'form': form})
