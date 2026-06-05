from django import forms
from .models import Video

class VideoForm(forms.ModelForm):

    class Meta:
        model = Video
        fields = '__all__'

        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Video Title'
            }),

            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Description (Optional)',
                'rows': 8
            }),

            'quality': forms.Select(attrs={
                'class': 'form-select'
            }),

            'publish_date': forms.DateInput(attrs={
                'class': 'form-control',
                'type': 'date'
            }),
        }