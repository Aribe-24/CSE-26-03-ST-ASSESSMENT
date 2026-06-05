from django import forms
from .models import Video

class VideoForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = ["video_title", "description", "video_quality", "date_of_publish", "video_file", "thumbnail"]
        widgets = {
            "video_title": forms.TextInput(attrs={"class": "form-control", "placeholder": "Video Title"}),
            "description": forms.Textarea(attrs={"class": "form-control", "placeholder": "Description (Optional)", "rows": 3}),
            "video_quality": forms.Select(attrs={"class": "form-select"}),
            "date_of_publish": forms.DateInput(attrs={"class": "form-control", "type": "date"}),
            "video_file": forms.FileInput(attrs={"class": "form-control"}),
            "thumbnail": forms.FileInput(attrs={"class": "form-control"}),
        }
