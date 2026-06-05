from datetime import datetime, date
from django.shortcuts import  render, redirect
from .models import Video


def welcome(request):
    return render(request, 'welcome.html')


def dashboard(request):
    videos = Video.objects.all().order_by('-created_at')
    return render(request, 'dashboard.html', {'videos': videos})


def add_video(request):
    errors = {}
    quality_choices = {'360p', '720p', '1080p'}

    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        quality = request.POST.get('quality', '').strip()
        publishing_date = request.POST.get('publishing_date', '').strip()
        video_file = request.FILES.get('video_file')
        thumbnail = request.FILES.get('thumbnail')

        pub_date = None

        if not title:
            errors['title'] = 'Title is required.'
        if not quality:
            errors['quality'] = 'Please select a video quality.'
        elif quality not in quality_choices:
            errors['quality'] = 'Please select a valid video quality.'
        if not publishing_date:
            errors['publishing_date'] = 'Please select a publishing date.'
        else:
            try:
                pub_date = datetime.strptime(publishing_date, '%Y-%m-%d').date()
            except ValueError:
                errors['publishing_date'] = 'Enter a valid publishing date.'

        if not video_file:
            errors['video_file'] = 'Please upload a video file.'
        if not thumbnail:
            errors['thumbnail'] = 'Please upload a thumbnail.'

        if not errors:
            if not pub_date:
                pub_date = date.today()
            Video.objects.create(
                title=title,
                description=description,
                quality=quality,
                publishing_date=pub_date,
                video_file=video_file,
                thumbnail=thumbnail,
            )
            return redirect('dashboard')

        context = {
            'errors': errors,
            'title': title,
            'description': description,
            'quality': quality,
            'publishing_date': publishing_date,
        }
        return render(request, 'videx-form.html', context)

    return render(request, 'videx-form.html', {'errors': {}, 'title': '', 'description': '', 'quality': '', 'publishing_date': ''})
