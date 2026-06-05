from django.shortcuts import render
from .models import Video
from .forms import VideoForm

# Create your views here.




def landing(request):
    return render(request, 'videx/landing.html')


def video_list(request):
    videos = Video.objects.all()
    return render(request, 'videx/video_list.html', {'videos': videos})


def upload_video(request):
    if request.method == 'POST':
        form = VideoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return render(request, 'videx/upload.html', {'form': VideoForm(), 'success': True})
        return render(request, 'videx/upload.html', {'form': form})
    form = VideoForm()
    return render(request, 'videx/upload.html', {'form': form})


def watch_video(request, pk):
    video = Video.objects.get(pk=pk)
    video.views += 1
    video.save()
    return render(request, 'videx/watch.html', {'video': video})

