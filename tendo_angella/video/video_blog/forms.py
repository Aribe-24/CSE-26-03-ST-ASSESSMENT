from django import forms
from .models import VideoUpload

class VideoUploadForm(forms.ModelForm):
    class Meta:
        model = VideoUpload
        fields = ['title', 'description', 'video_quality', 'date_of_publishing', 'video_file', 'thumbnail']
        
        widgets = {
            'title': forms.TextInput(attrs={'placeholder': 'Video Title', 'class': 'form-control'}),
            'description': forms.Textarea(attrs={'placeholder': 'Description (Optional)', 'rows': 4, 'class': 'form-control'}),
            'video_quality': forms.Select(attrs={'class': 'form-select'}),
            'date_of_publishing': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'video_file': forms.FileInput(attrs={'class': 'form-control'}),
            'thumbnail': forms.FileInput(attrs={'class': 'form-control'}),
        }

    def clean(self):
        cleaned_data = super().clean()
        
        # Define fields in the exact sequential order they appear in the UI
        sequential_fields = ['title', 'video_quality', 'date_of_publishing', 'video_file', 'thumbnail']
        
        for field_name in sequential_fields:
            value = cleaned_data.get(field_name)
            
            # If a field is missing, clear all other errors and only show this one
            if not value:
                self._errors.clear()  # Wipes out simultaneous errors
                self.add_error(field_name, 'Required field')
                break # Stops the validation immediately to handle them one by one
                
        return cleaned_data