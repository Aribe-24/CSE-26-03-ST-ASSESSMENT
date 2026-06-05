from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Video
from .forms import VideoUploadForm
# Create your views here.
# Views for video upload, listing, and detail display
def landing(request):
    return render(request, 'landing.html')

# List videos ordered by upload date (newest first)
def video_list(request):
    videos = Video.objects.all()
    return render(request, 'video_list.html', {'videos': videos})

# Handle video upload form submission
def upload_video(request):
    # Only allow POST requests to handle form submission
    if request.method == 'POST':
        #VideoUploadForm(request.POST, request.FILES) creates a form instance with the submitted data and files
        form = VideoUploadForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Video uploaded successfully!')
            return redirect('video_list')
    else:
        form = VideoUploadForm()
    return render(request, 'upload.html', {'form': form})

# Display video details and increment view count
def video_detail(request, pk):
    #get_object_or_404(Video, pk=pk) retrieves the video with the given primary key (pk) or returns a 404 error if it doesn't exist
    video = get_object_or_404(Video, pk=pk)
    # Each time the video detail page is accessed, increment the view count and save the video instance
    video.views += 1
    video.save()
    return render(request, 'video_detail.html', {'video': video})