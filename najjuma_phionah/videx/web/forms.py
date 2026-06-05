from pathlib import Path

from django import forms

from .models import Video


class VideoForm(forms.ModelForm):
    allowed_video_extensions = {'.mp4', '.webm', '.ogg', '.mov'}
    allowed_thumbnail_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
    use_required_attribute = False

    quality = forms.ChoiceField(
        choices=[
            ('', 'Video quality'),
            ('360p', '360p'),
            ('720p', '720p'),
            ('1080p', '1080p'),
        ],
        error_messages={'required': 'Required field'},
    )

    class Meta:
        model = Video
        fields = [
            'title',
            'description',
            'quality',
            'publishing_date',
            'video_file',
            'thumbnail',
        ]
        labels = {
            'title': '',
            'description': '',
            'quality': '',
            'publishing_date': '',
            'video_file': '',
            'thumbnail': '',
        }
        widgets = {
            'title': forms.TextInput(attrs={'placeholder': 'Video Title'}),
            'description': forms.Textarea(attrs={'placeholder': 'Description (Optional)', 'rows': 6}),
            'publishing_date': forms.TextInput(attrs={'type':'date','placeholder': 'Date of Publishing'}),
            'video_file': forms.FileInput(attrs={'accept': 'video/mp4,video/webm,video/ogg,video/quicktime'}),
            'thumbnail': forms.FileInput(attrs={'accept': 'image/jpeg,image/png,image/gif,image/webp'}),
        }
        error_messages = {
            'title': {'required': 'Required field'},
            'quality': {'required': 'Required field'},
            'publishing_date': {'required': 'Required field'},
            'video_file': {'required': 'Required field'},
            'thumbnail': {'required': 'Required field'},
        }

    def clean_video_file(self):
        video_file = self.cleaned_data.get('video_file')
        if video_file:
            extension = Path(video_file.name).suffix.lower()
            if extension not in self.allowed_video_extensions:
                raise forms.ValidationError('Upload a valid video file.')
        return video_file

    def clean_thumbnail(self):
        thumbnail = self.cleaned_data.get('thumbnail')
        if thumbnail:
            extension = Path(thumbnail.name).suffix.lower()
            if extension not in self.allowed_thumbnail_extensions:
                raise forms.ValidationError('Upload a valid image file.')
        return thumbnail
