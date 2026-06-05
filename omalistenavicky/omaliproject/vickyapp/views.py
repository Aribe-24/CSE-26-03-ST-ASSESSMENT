# ==================== IMPORTS ====================
from django.shortcuts import render, redirect
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.contrib import messages
from django.utils import timezone
import random
import os
from datetime import datetime, timedelta


# Add these imports at the top of your views.py if not already present
from django.core.exceptions import ValidationError
from django.contrib import messages
import re
from datetime import datetime

# ==================== VALIDATION FUNCTIONS ====================

def validate_title(title):
    """Validate video title"""
    if not title or not title.strip():
        raise ValidationError('Video title is required.')
    
    title = title.strip()
    if len(title) < 3:
        raise ValidationError('Title must be at least 3 characters long.')
    
    if len(title) > 200:
        raise ValidationError('Title cannot exceed 200 characters.')
    
    return title


def validate_description(description):
    """Validate video description"""
    if description and len(description) > 2000:
        raise ValidationError('Description cannot exceed 2000 characters.')
    return description or ""


def validate_video_file(video_file):
    """Validate uploaded video file"""
    if not video_file:
        raise ValidationError('Please select a video file to upload.')
    
    # Check file size (500MB max)
    if video_file.size > 500 * 1024 * 1024:
        size_mb = video_file.size / (1024 * 1024)
        raise ValidationError(f'Video file size must be less than 500MB. Current: {size_mb:.1f}MB')
    
    # Check file extension
    valid_extensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    file_ext = os.path.splitext(video_file.name)[1].lower()
    if file_ext not in valid_extensions:
        raise ValidationError(f'Unsupported video format. Use: {", ".join(valid_extensions)}')
    
    return True


def validate_thumbnail(thumbnail):
    """Validate uploaded thumbnail image"""
    if not thumbnail:
        return True
    
    # Check file size (10MB max)
    if thumbnail.size > 10 * 1024 * 1024:
        size_mb = thumbnail.size / (1024 * 1024)
        raise ValidationError(f'Thumbnail size must be less than 10MB. Current: {size_mb:.1f}MB')
    
    # Check file extension
    valid_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    file_ext = os.path.splitext(thumbnail.name)[1].lower()
    if file_ext not in valid_extensions:
        raise ValidationError(f'Thumbnail must be an image. Use: {", ".join(valid_extensions)}')
    
    return True


def validate_quality(quality):
    """Validate video quality"""
    valid_qualities = ['1080p', '720p', '480p', '4k']
    if quality not in valid_qualities:
        raise ValidationError(f'Invalid quality. Choose from: {", ".join(valid_qualities)}')
    return quality


def validate_publish_date(date_str):
    """Validate publish date"""
    if not date_str:
        return None
    
    try:
        publish_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        today = timezone.now().date()
        max_future = today + timedelta(days=3650)  # 10 years
        
        if publish_date > max_future:
            raise ValidationError('Publish date cannot be more than 10 years in the future.')
        
        return publish_date
    except ValueError:
        raise ValidationError('Invalid date format. Use YYYY-MM-DD.')
videos = [
    {
        'id': 1,
        'title': 'Arsenal wins the premier league after 22 years.',
        'views': '999k views',
        'date': '2 weeks ago',
        'description': 'Watch the incredible moment Arsenal clinched the Premier League title.',
        'quality': '1080p',
        'created_at': timezone.now() - timedelta(days=14)
    },
    {
        'id': 2,
        'title': 'Manchester City lost its 2nd Consecutive premier league title.',
        'views': '999k views',
        'date': '2 weeks ago',
        'description': 'Manchester City falls short in their title defense.',
        'quality': '1080p',
        'created_at': timezone.now() - timedelta(days=14)
    },
    {
        'id': 3,
        'title': 'Manchester United fan faints after Arsenal was declared winners of ...',
        'views': '999k views',
        'date': '2 weeks ago',
        'description': 'Shocking reaction from a Manchester United supporter.',
        'quality': '1080p',
        'created_at': timezone.now() - timedelta(days=13)
    },
    {
        'id': 4,
        'title': 'UCL 2026 Finals referee to be investigated over bribery allegations...',
        'views': '999k views',
        'date': '6 days ago',
        'description': 'Controversy surrounds the Champions League final.',
        'quality': '1080p',
        'created_at': timezone.now() - timedelta(days=6)
    },
    {
        'id': 5,
        'title': 'Refactory launches an AI powered Job board',
        'views': '999k views',
        'date': '3 months ago',
        'description': 'Revolutionary AI job matching platform launched.',
        'quality': '1080p',
        'created_at': timezone.now() - timedelta(days=90)
    },
    {
        'id': 6,
        'title': 'Who won the Spelling Bee 2026 finals?',
        'views': '999k views',
        'date': '2 weeks ago',
        'description': 'Intense competition at the national spelling bee championship.',
        'quality': '1080p',
        'created_at': timezone.now() - timedelta(days=14)
    },
    {
        'id': 7,
        'title': 'Learn Python programming with Jaija Ozzy.',
        'views': '999k views',
        'date': '6 years ago',
        'description': 'Complete Python programming tutorial for beginners.',
        'quality': '720p',
        'created_at': timezone.now() - timedelta(days=2190)
    },
    {
        'id': 8,
        'title': 'Learn socket programming using the NodeJS framework',
        'views': '999k views',
        'date': '5 years ago',
        'description': 'Master socket programming with NodeJS.',
        'quality': '720p',
        'created_at': timezone.now() - timedelta(days=1825)
    },
]


def generate_random_views():
    """Generate random view counts for new uploads (between 100 and 1.5M)"""
    rand = random.randint(100, 1500000)
    if rand >= 1000000:
        return f"{rand // 1000000}.{(rand % 1000000) // 100000}M views"
    elif rand >= 1000:
        return f"{rand // 1000}.{(rand % 1000) // 100}k views"
    return f"{rand} views"


def get_relative_date(date_obj):
    """Convert datetime to relative date string"""
    if not date_obj:
        return "just now"
    
    now = timezone.now()
    diff = now - date_obj
    
    if diff.days == 0:
        return "today"
    elif diff.days == 1:
        return "yesterday"
    elif diff.days < 7:
        return f"{diff.days} days ago"
    elif diff.days < 30:
        weeks = diff.days // 7
        return f"{weeks} week{'s' if weeks > 1 else ''} ago"
    elif diff.days < 365:
        months = diff.days // 30
        return f"{months} month{'s' if months > 1 else ''} ago"
    else:
        years = diff.days // 365
        return f"{years} year{'s' if years > 1 else ''} ago"


def index(request):
    """Landing page view"""
    return render(request, 'index.html')


def home(request):
    """Display all videos - sorted newest first"""
    sorted_videos = sorted(videos, key=lambda x: x['created_at'], reverse=True)
    return render(request, 'home.html', {'videos': sorted_videos})


def video_page(request):
    """Display the video player page"""
    return render(request, 'video.html')


def video_detail(request, video_id):
    """Display individual video details"""
    video = next((v for v in videos if v['id'] == video_id), None)
    if video:
        return render(request, 'video_detail.html', {'video': video})
    messages.error(request, 'Video not found.')
    return redirect('home')



def upload_video(request):
    """Handle video uploads - GET: show form, POST: process upload"""
    
    # Handle POST request (form submission)
    if request.method == 'POST':
        # Get form data
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        quality = request.POST.get('quality', '1080p')
        publish_date = request.POST.get('publish_date', '')
        
        # Get files
        video_file = request.FILES.get('video_file')
        thumbnail = request.FILES.get('thumbnail')
        
        # Validation
        if not title:
            messages.error(request, 'Please enter a video title.')
            return redirect('upload_video')
        
        if not video_file:
            messages.error(request, 'Please select a video file to upload.')
            return redirect('upload_video')
        
        # Create upload directories if they don't exist
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'videos'), exist_ok=True)
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'thumbnails'), exist_ok=True)
        
        # Save video file
        fs = FileSystemStorage()
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        safe_name = f"{timestamp}_{video_file.name.replace(' ', '_')}"
        video_filename = fs.save(f'videos/{safe_name}', video_file)
        
        # Save thumbnail if provided
        thumbnail_filename = None
        if thumbnail:
            safe_thumb = f"{timestamp}_{thumbnail.name.replace(' ', '_')}"
            thumbnail_filename = fs.save(f'thumbnails/{safe_thumb}', thumbnail)
        
        # Generate random views for new video
        views_count = generate_random_views()
        
        # Create new video object
        new_id = max([v['id'] for v in videos], default=0) + 1
        new_video = {
            'id': new_id,
            'title': title,
            'views': views_count,
            'date': get_relative_date(timezone.now()),
            'description': description if description else "No description provided.",
            'quality': quality,
            'video_file': video_filename,
            'thumbnail': thumbnail_filename,
            'created_at': timezone.now()
        }
        
        # Add to videos list
        videos.append(new_video)
        
        # Success message and redirect
        messages.success(request, f'✅ "{title}" has been uploaded successfully!')
        return redirect('home')
    
    # Handle GET request (show empty form)
    return render(request, 'now.html')






def validate_title(title):
    """Validate video title"""
    if not title or not title.strip():
        raise ValidationError('Video title is required.')
    
    title = title.strip()
    if len(title) < 3:
        raise ValidationError('Title must be at least 3 characters long.')
    
    if len(title) > 200:
        raise ValidationError('Title cannot exceed 200 characters.')
    
    # Check for prohibited characters (optional)
    prohibited = ['<', '>', 'script', 'javascript']
    for word in prohibited:
        if word.lower() in title.lower():
            raise ValidationError('Title contains invalid characters.')
    
    return title


def validate_description(description):
    """Validate video description"""
    if not description:
        return ""
    
    if len(description) > 2000:
        raise ValidationError('Description cannot exceed 2000 characters.')
    
    return description.strip()


def validate_video_file(video_file):
    """Validate uploaded video file"""
    if not video_file:
        raise ValidationError('Please select a video file to upload.')
    
    # Check file size (500MB = 524288000 bytes)
    max_size = 500 * 1024 * 1024
    if video_file.size > max_size:
        raise ValidationError(f'Video file size must be less than 500MB. Current: {video_file.size / (1024*1024):.1f}MB')
    
    # Check file extension
    valid_extensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    file_ext = os.path.splitext(video_file.name)[1].lower()
    if file_ext not in valid_extensions:
        raise ValidationError(f'Unsupported video format. Use: {", ".join(valid_extensions)}')
    
    # Check content type (if available)
    if hasattr(video_file, 'content_type'):
        valid_types = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm']
        if video_file.content_type not in valid_types:
            raise ValidationError('Invalid video file type.')
    
    return True


def validate_thumbnail(thumbnail):
    """Validate uploaded thumbnail image"""
    if not thumbnail:
        return True  # Thumbnail is optional
    
    # Check file size (10MB = 10485760 bytes)
    max_size = 10 * 1024 * 1024
    if thumbnail.size > max_size:
        raise ValidationError(f'Thumbnail size must be less than 10MB. Current: {thumbnail.size / (1024*1024):.1f}MB')
    
    # Check file extension
    valid_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    file_ext = os.path.splitext(thumbnail.name)[1].lower()
    if file_ext not in valid_extensions:
        raise ValidationError(f'Thumbnail must be an image. Use: {", ".join(valid_extensions)}')
    
    # Check content type
    if hasattr(thumbnail, 'content_type'):
        valid_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if thumbnail.content_type not in valid_types:
            raise ValidationError('Invalid image format. Use JPEG, PNG, WebP, or GIF.')
    
    return True


def validate_quality(quality):
    """Validate video quality selection"""
    valid_qualities = ['1080p', '720p', '480p', '4k', '1440p']
    if quality not in valid_qualities:
        raise ValidationError(f'Invalid quality. Choose from: {", ".join(valid_qualities)}')
    return quality


def validate_publish_date(date_str):
    """Validate publish date"""
    if not date_str:
        return None
    
    try:
        publish_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        today = timezone.now().date()
        
        # Cannot be in the past (optional - uncomment if needed)
        # if publish_date < today:
        #     raise ValidationError('Publish date cannot be in the past.')
        
        # Cannot be more than 10 years in the future
        max_future = today + timedelta(days=3650)
        if publish_date > max_future:
            raise ValidationError('Publish date cannot be more than 10 years in the future.')
        
        return publish_date
    except ValueError:
        raise ValidationError('Invalid date format. Use YYYY-MM-DD.')


# ==================== UPDATED UPLOAD_VIDEO VIEW WITH VALIDATION ====================

def upload_video(request):
    """Handle video uploads with comprehensive validation"""
    
    if request.method == 'POST':
        errors = {}
        
        # Get form data
        title = request.POST.get('title', '')
        description = request.POST.get('description', '')
        quality = request.POST.get('quality', '1080p')
        publish_date = request.POST.get('publish_date', '')
        
        # Get files
        video_file = request.FILES.get('video_file')
        thumbnail = request.FILES.get('thumbnail')
        
        # Validate title
        try:
            validated_title = validate_title(title)
        except ValidationError as e:
            errors['title'] = str(e)
        
        # Validate description
        try:
            validated_description = validate_description(description)
        except ValidationError as e:
            errors['description'] = str(e)
        
        # Validate quality
        try:
            validated_quality = validate_quality(quality)
        except ValidationError as e:
            errors['quality'] = str(e)
        
        # Validate video file
        try:
            validate_video_file(video_file)
            has_video = True
        except ValidationError as e:
            errors['video_file'] = str(e)
            has_video = False
        
        # Validate thumbnail
        try:
            validate_thumbnail(thumbnail)
        except ValidationError as e:
            errors['thumbnail'] = str(e)
        
        # Validate publish date
        try:
            validated_publish_date = validate_publish_date(publish_date)
        except ValidationError as e:
            errors['publish_date'] = str(e)
        
        # If there are validation errors, return to form with error messages
        if errors:
            for field, error in errors.items():
                messages.error(request, f'{field.replace("_", " ").title()}: {error}')
            
            # Return to upload page with previously entered data
            return render(request, 'now.html', {
                'title': title,
                'description': description,
                'quality': quality,
                'publish_date': publish_date,
                'errors': errors
            })
        
        # Create upload directories if they don't exist
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'videos'), exist_ok=True)
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'thumbnails'), exist_ok=True)
        
        # Save video file
        fs = FileSystemStorage()
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        safe_name = f"{timestamp}_{re.sub(r'[^a-zA-Z0-9._-]', '_', video_file.name)}"
        video_filename = fs.save(f'videos/{safe_name}', video_file)
        
        # Save thumbnail if provided
        thumbnail_filename = None
        if thumbnail:
            safe_thumb = f"{timestamp}_{re.sub(r'[^a-zA-Z0-9._-]', '_', thumbnail.name)}"
            thumbnail_filename = fs.save(f'thumbnails/{safe_thumb}', thumbnail)
        
        # Generate random views for new video
        views_count = generate_random_views()
        
        # Create new video object
        new_id = max([v['id'] for v in videos], default=0) + 1
        new_video = {
            'id': new_id,
            'title': validated_title,
            'views': views_count,
            'date': 'just now',
            'description': validated_description if validated_description else "No description provided.",
            'quality': validated_quality,
            'video_file': video_filename,
            'thumbnail': thumbnail_filename,
            'created_at': timezone.now()
        }
        
        # Add to videos list
        videos.append(new_video)
        
        messages.success(request, f'✅ "{validated_title}" has been uploaded successfully!')
        return redirect('home')
    
    # GET request - show empty form
    return render(request, 'now.html')


# ==================== OPTIONAL: FORM VALIDATION CLASS ====================
from django import forms

class VideoUploadForm(forms.Form):
    """Django Form class with built-in validation - Alternative approach"""
    
    title = forms.CharField(
        max_length=200,
        min_length=3,
        required=True,
        error_messages={
            'required': 'Video title is required.',
            'min_length': 'Title must be at least 3 characters long.',
            'max_length': 'Title cannot exceed 200 characters.'
        },
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter video title'
        })
    )
    
    description = forms.CharField(
        required=False,
        max_length=2000,
        widget=forms.Textarea(attrs={
            'rows': 4,
            'class': 'form-control',
            'placeholder': 'Describe your video...'
        })
    )
    
    quality = forms.ChoiceField(
        choices=[
            ('1080p', '1080p (Full HD)'),
            ('720p', '720p (HD)'),
            ('480p', '480p (Standard)'),
            ('4k', '4K (Ultra HD)')
        ],
        initial='1080p',
        required=True
    )
    
    publish_date = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={'type': 'date', 'class': 'form-control'})
    )
    
    video_file = forms.FileField(
        required=True,
        widget=forms.FileInput(attrs={'class': 'form-control', 'accept': 'video/*'})
    )
    
    thumbnail = forms.FileField(
        required=False,
        widget=forms.FileInput(attrs={'class': 'form-control', 'accept': 'image/*'})
    )
    
    def clean_video_file(self):
        """Custom validation for video file"""
        video_file = self.cleaned_data.get('video_file')
        
        if not video_file:
            raise forms.ValidationError('Please select a video file to upload.')
        
        # Check file size (500MB)
        if video_file.size > 500 * 1024 * 1024:
            raise forms.ValidationError(f'Video file size must be less than 500MB. Current: {video_file.size / (1024*1024):.1f}MB')
        
        # Check file extension
        valid_extensions = ['.mp4', '.mov', '.avi', '.mkv']
        file_ext = os.path.splitext(video_file.name)[1].lower()
        if file_ext not in valid_extensions:
            raise forms.ValidationError(f'Unsupported video format. Use: {", ".join(valid_extensions)}')
        
        return video_file
    
    def clean_thumbnail(self):
        """Custom validation for thumbnail"""
        thumbnail = self.cleaned_data.get('thumbnail')
        
        if not thumbnail:
            return thumbnail
        
        # Check file size (10MB)
        if thumbnail.size > 10 * 1024 * 1024:
            raise forms.ValidationError(f'Thumbnail size must be less than 10MB. Current: {thumbnail.size / (1024*1024):.1f}MB')
        
        # Check file extension
        valid_extensions = ['.jpg', '.jpeg', '.png', '.webp']
        file_ext = os.path.splitext(thumbnail.name)[1].lower()
        if file_ext not in valid_extensions:
            raise forms.ValidationError(f'Thumbnail must be an image. Use: {", ".join(valid_extensions)}')
        
        return thumbnail
    
    def clean_publish_date(self):
        """Custom validation for publish date"""
        publish_date = self.cleaned_data.get('publish_date')
        
        if publish_date:
            today = timezone.now().date()
            max_future = today + timedelta(days=3650)
            
            if publish_date > max_future:
                raise forms.ValidationError('Publish date cannot be more than 10 years in the future.')
        
        return publish_date


def upload_video_form_view(request):
    """Alternative upload view using Django Form class"""
    
    if request.method == 'POST':
        form = VideoUploadForm(request.POST, request.FILES)
        
        if form.is_valid():
            # Process valid form
            title = form.cleaned_data['title']
            description = form.cleaned_data['description']
            quality = form.cleaned_data['quality']
            video_file = form.cleaned_data['video_file']
            thumbnail = form.cleaned_data['thumbnail']
            
            # Save file and create video object (same as above)
            # ... (add your save logic here)
            
            messages.success(request, f'✅ "{title}" uploaded successfully!')
            return redirect('home')
        else:
            # Form has errors - display them
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f'{field.replace("_", " ").title()}: {error}')
    else:
        form = VideoUploadForm()
    
    return render(request, 'upload.html', {'form': form})