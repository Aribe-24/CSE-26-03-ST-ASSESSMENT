from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Video
from .forms import VideoForm
# Create your views here.

def landing(request):
    return render(request, 'landing.html')


def video_list(request):

    videos = Video.objects.all()

    return render(
        request,
        'video_list.html',
        {'videos': videos}
    )


def upload_video(request):

    if request.method == 'POST':

        form = VideoForm(
            request.POST,
            request.FILES
        )

        if form.is_valid():

            form.save()

            messages.success(
                request,
                'Video added successfully'
            )

            return redirect('video_list')

    else:
        form = VideoForm()

    return render(
        request,
        'upload_video.html',
        {'form': form}
    )