from django.shortcuts import render
from .models import Video
from .forms import VideoUploadForm
from django.contrib import messages

# Create your views here.
def home(request):
    return render(request, 'home.html') 
def video_display(request):
    videos = Video.objects.all().order_by('-id') # Fetch videos ordered by most recent
    return render(request, 'video_display.html', {'videos': videos})
def add_video(request):
    if request.method == 'POST':
        form = VideoUploadForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Video added successfully')
            return redirect('videos_page')  # redirect to display page
    else:
        form = VideoUploadForm()
    return render(request, 'add_video.html', {'form': form})

    return render(request, 'add_video.html')    
