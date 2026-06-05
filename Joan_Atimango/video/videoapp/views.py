from django.shortcuts import redirect, render
from django.contrib import messages
from .forms import VideoForm
from .models import Videos

# Create your views here.
def home(request):
    return render(request, 'home.html')

def video_display(request):
    videos = Videos.objects.all()
    return render(request, 'video_display.html', {'videos': videos})


def add_video(request):
    if request.method == 'POST':
        form = VideoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Video uploaded successfully.')
            return redirect('add_video')
    else:
        form = VideoForm()

    return render(request, 'add_video.html', {'form': form})