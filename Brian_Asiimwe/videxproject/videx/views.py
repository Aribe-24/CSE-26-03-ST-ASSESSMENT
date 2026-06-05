from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Video

# Create your views here.
def landing_page(request):
    return render(request, "landing.html")

def video_list(request):
    return render(request,"video_list.html",{"videos": Video.objects.all()})

def add_video(request):
    errors = {}
    form_data = {}

    if request.method == "POST":

        title = request.POST.get("title", "").strip()
        description = request.POST.get("description", "").strip()
        quality = request.POST.get("quality", "").strip()
        publishing_date = request.POST.get("publishing_date", "")
        video_file = request.FILES.get("video_file")
        thumbnail = request.FILES.get("thumbnail")
        
        form_data = {
            "title": title,
            "description": description,
            "quality": quality,
            "publishing_date": publishing_date,
        }
        
        if not title:
            errors["title"] = "Video title is required."

        if quality not in ["360p", "720p", "1080p", "4K"]:
            errors["quality"] = (
                "Please select a valid video quality."
            )

        if not publishing_date:
            errors["publishing_date"] = (
                "Publishing date is required."
            )

        if not video_file:
            errors["video_file"] = (
                "Please upload a video."
            )

        elif video_file.content_type not in [
            "video/mp4",
            "video/webm",
            "video/ogg",
        ]:
            errors["video_file"] = (
                "Only MP4, WEBM and OGG videos are allowed."
            )

        if not thumbnail:
            errors["thumbnail"] = (
                "Please upload a thumbnail."
            )

        elif thumbnail.content_type not in [
            "image/jpeg",
            "image/jpg",
            "image/png",
        ]:
            errors["thumbnail"] = (
                "Only JPG and PNG images are allowed."
            )

        if not errors:

            Video.objects.create(
                title=title,
                description=description,
                quality=quality,
                publishing_date=publishing_date,
                video_file=video_file,
                thumbnail=thumbnail,
            )

            messages.success(
                request,
                "Video uploaded successfully."
            )

            return redirect("add_video")

    return render(request,"add_video.html",{"errors": errors, "form_data": form_data })

def watch_video(request, pk):
    video = get_object_or_404(Video,pk=pk)
    video.views += 1
    video.save()
    return render(request,"watch_video.html",{"video": video})