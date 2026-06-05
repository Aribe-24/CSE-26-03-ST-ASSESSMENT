from django import forms
from .models import Video

class VideoForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = ["video_title", "description", "video_quality", "date_of_publish", "video_file", "thumbnail"]
        error_messages = {
            "video_title": {"required": "Required field"},
            "video_quality": {"required": "Required field"},
            "date_of_publish": {"required": "Required field"},
            "video_file": {"required": "Required field"},
        }
        widgets = {
            "video_title": forms.TextInput(attrs={"class": "form-control", "placeholder": "Video Title"}),
            "description": forms.Textarea(attrs={"class": "form-control", "placeholder": "Description (Optional)", "rows": 6}),
            "video_quality": forms.Select(attrs={"class": "form-select", "placeholder": "Video quality"}),
            "date_of_publish": forms.DateInput(attrs={"class": "form-control", "type": "date"}),
       
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self.fields["video_file"].widget.attrs.update({"class": "d-none", "id": "id_video_file"})
        self.fields["thumbnail"].widget.attrs.update({"class": "d-none", "id": "id_thumbnail"})

        for field_name in self.errors:
            self.fields[field_name].widget.attrs["class"] = (
            self.fields[field_name].widget.attrs.get("class", "")
            + " is-invalid"
        )