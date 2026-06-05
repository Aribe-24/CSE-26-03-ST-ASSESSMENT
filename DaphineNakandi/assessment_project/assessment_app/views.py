from django.shortcuts import render, redirect
from .forms import VideoForm
from .models import Video

# Create your views here.
# Landing page
def landing(request):
    return render(request, 'assessment_app/landing.html')

# Upload form
def upload_video(request):
    if request.method == 'POST':
        form = VideoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('video_list')
        else:
            return render(request, 'assessment_app/upload.html', {'form': form})
    else:
        form = VideoForm()
    return render(request, 'assessment_app/upload.html', {'form': form})

# Video listing
def video_list(request):
    videos = Video.objects.all().order_by('-date_of_publish')
    return render(request, 'assessment_app/video_list.html', {'videos': videos})
