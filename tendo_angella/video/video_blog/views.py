from django.shortcuts import render, redirect
from .models import VideoUpload
from .forms import VideoUploadForm
from django.contrib import messages

# Create your views here.
def landing_view(request):
    return render(request, 'landing.html')

def video_list_view(request):
    #ordered by newest publishing date
    videos = VideoUpload.objects.all().order_by('-pk')
    
    return render(request, 'video_list.html', {'videos': videos})

def upload_video_view(request):
    if request.method == 'POST':
        form = VideoUploadForm(request.POST, request.FILES)
        if form.is_valid():
            # Save the video record to the database
            saved_video = form.save()
            
            messages.success(request, 'Video uploaded successfully')
            
            # Re-initialize the form using the saved video instance data.
            # This allows the template to cleanly display the video player and thumbnail image.
            form = VideoUploadForm(instance=saved_video)
    else:
        form = VideoUploadForm()
        
    return render(request, 'upload.html', {'form': form})