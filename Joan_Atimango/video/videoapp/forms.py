from django import forms
from .models import Videos

class VideoForm(forms.ModelForm):
    class Meta:
        model = Videos
        fields = ['title', 'description', 'quality', 'published_date', 'file', 'thumbnail']
        widgets = {
            'title': forms.TextInput(attrs={'placeholder': 'Video Title'}),
            'description': forms.Textarea(attrs={'placeholder': 'Description (Optional)', 'rows': 4}),
            'quality': forms.Select(choices=[('720p', '720p'), ('1080p', '1080p'), ('4K', '4K')]),
            'published_date': forms.DateInput(attrs={'type': 'date'}),
        }