from django import forms
from .models import Video

class VideoUploadForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = [
            'title',
            'description',
            'video_file',
            'thumb_nail',
            'quality',
            'date_of_publishing'
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Video Title'
            }),
            'description': forms.Textarea(attrs={
                'rows': 4,
                'class': 'form-control',
                'placeholder': 'Description (Optional)'
            }),
            'video_file': forms.FileInput(attrs={
                'class': 'form-control'
            }),
            'thumb_nail': forms.FileInput(attrs={
                'class': 'form-control'
            }),
            'quality': forms.Select(attrs={
                'class': 'form-control'
            }),
            'date_of_publishing': forms.DateInput(attrs={
                'type': 'date',
                'class': 'form-control'
            }),
        }
