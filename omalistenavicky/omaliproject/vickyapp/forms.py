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