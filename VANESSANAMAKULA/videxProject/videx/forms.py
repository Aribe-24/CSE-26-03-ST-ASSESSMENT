from django import forms
from .models import Video


class VideoForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = ['title', 'description', 'quality', 'date_of_publishing', 'video_file', 'thumbnail']
        widgets = {
            'title': forms.TextInput(attrs={'placeholder': 'Video Title', 'class': 'form-input'}),
            'description': forms.Textarea(attrs={'placeholder': 'Description (Optional)', 'class': 'form-input', 'rows': 5}),
            'quality': forms.Select(attrs={'class': 'form-input form-select'}),
            'date_of_publishing': forms.DateInput(attrs={'placeholder': 'Date of Publishing', 'class': 'form-input', 'type': 'date'}),
            'video_file': forms.FileInput(attrs={'class': 'file-input', 'accept': 'video/*', 'id': 'video_file'}),
            'thumbnail': forms.FileInput(attrs={'class': 'file-input', 'accept': 'image/*', 'id': 'thumbnail'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['description'].required = False
        self.fields['thumbnail'].required = False
        self.fields['quality'].empty_label = 'Video quality'