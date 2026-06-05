from django import forms
from .models import Video

class VideoUploadForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = ['title', 'description', 'video_file', 'thumbnail', 'quality']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-500',
                'placeholder': 'Video Title',
            }),
            'description': forms.Textarea(attrs={
                'class': 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-500',
                'placeholder': 'Description (Optional)',
                'rows': 3,
            }),
            'video_file': forms.FileInput(attrs={
                'class': 'hidden',
                'accept': 'video/*',
                'id': 'video_input',
            }),
            'thumbnail': forms.FileInput(attrs={
                'class': 'hidden',
                'accept': 'image/*',
                'id': 'thumbnail_input',
            }),
            'quality': forms.Select(attrs={
                'class': 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-500',
            }),
        }
        from django import forms
from django.core.exceptions import ValidationError
from django.utils import timezone
import os
from datetime import timedelta


class VideoUploadForm(forms.Form):
    """Video upload form with comprehensive validation"""
    
    title = forms.CharField(
        max_length=200,
        min_length=3,
        required=True,
        error_messages={
            'required': '⚠️ Video title is required.',
            'min_length': '⚠️ Title must be at least 3 characters long.',
            'max_length': '⚠️ Title cannot exceed 200 characters.'
        },
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter an attention-grabbing title',
            'id': 'videoTitle'
        })
    )
    
    description = forms.CharField(
        required=False,
        max_length=2000,
        widget=forms.Textarea(attrs={
            'rows': 4,
            'class': 'form-control',
            'placeholder': 'Tell viewers what your video is about...',
            'id': 'videoDesc'
        })
    )
    
    quality = forms.ChoiceField(
        choices=[
            ('1080p', '1080p (Full HD) - Recommended'),
            ('720p', '720p (HD)'),
            ('480p', '480p (Standard)'),
            ('4k', '4K (Ultra HD)')
        ],
        initial='1080p',
        required=True,
        widget=forms.Select(attrs={
            'class': 'form-control',
            'id': 'videoQuality'
        })
    )
    
    publish_date = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={
            'type': 'date',
            'class': 'form-control',
            'id': 'publishDate'
        })
    )
    
    video_file = forms.FileField(
        required=True,
        widget=forms.FileInput(attrs={
            'class': 'form-control-file',
            'accept': 'video/*',
            'id': 'videoFileInput'
        })
    )
    
    thumbnail = forms.FileField(
        required=False,
        widget=forms.FileInput(attrs={
            'class': 'form-control-file',
            'accept': 'image/*',
            'id': 'thumbFileInput'
        })
    )
    
    def clean_title(self):
        """Validate video title"""
        title = self.cleaned_data.get('title')
        if title:
            title = title.strip()
            
            # Check for prohibited characters
            prohibited = ['<', '>', 'script', 'javascript', 'onclick', 'onerror']
            for word in prohibited:
                if word.lower() in title.lower():
                    raise ValidationError('⚠️ Title contains invalid characters.')
            
            # Check for duplicate title (optional)
            # from .views import videos
            # if any(v['title'].lower() == title.lower() for v in videos):
            #     raise ValidationError('⚠️ A video with this title already exists.')
        
        return title
    
    def clean_description(self):
        """Validate video description"""
        description = self.cleaned_data.get('description')
        if description and len(description) > 2000:
            raise ValidationError('⚠️ Description cannot exceed 2000 characters.')
        return description
    
    def clean_video_file(self):
        """Validate video file"""
        video_file = self.cleaned_data.get('video_file')
        
        if not video_file:
            raise ValidationError('⚠️ Please select a video file to upload.')
        
        # Check file size (500MB = 524288000 bytes)
        max_size = 500 * 1024 * 1024
        if video_file.size > max_size:
            size_mb = video_file.size / (1024 * 1024)
            raise ValidationError(f'⚠️ Video file size must be less than 500MB. Current: {size_mb:.1f}MB')
        
        # Check file extension
        valid_extensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm']
        file_ext = os.path.splitext(video_file.name)[1].lower()
        if file_ext not in valid_extensions:
            raise ValidationError(f'⚠️ Unsupported video format. Use: {", ".join(valid_extensions)}')
        
        # Check file name length
        if len(video_file.name) > 100:
            raise ValidationError('⚠️ Video file name is too long. Please rename the file.')
        
        return video_file
    
    def clean_thumbnail(self):
        """Validate thumbnail image"""
        thumbnail = self.cleaned_data.get('thumbnail')
        
        if not thumbnail:
            return thumbnail
        
        # Check file size (10MB = 10485760 bytes)
        max_size = 10 * 1024 * 1024
        if thumbnail.size > max_size:
            size_mb = thumbnail.size / (1024 * 1024)
            raise ValidationError(f'⚠️ Thumbnail size must be less than 10MB. Current: {size_mb:.1f}MB')
        
        # Check file extension
        valid_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
        file_ext = os.path.splitext(thumbnail.name)[1].lower()
        if file_ext not in valid_extensions:
            raise ValidationError(f'⚠️ Thumbnail must be an image. Use: {", ".join(valid_extensions)}')
        
        return thumbnail
    
    def clean_publish_date(self):
        """Validate publish date"""
        publish_date = self.cleaned_data.get('publish_date')
        
        if publish_date:
            today = timezone.now().date()
            max_future = today + timedelta(days=3650)  # 10 years
            
            if publish_date > max_future:
                raise ValidationError('⚠️ Publish date cannot be more than 10 years in the future.')
        
        return publish_date