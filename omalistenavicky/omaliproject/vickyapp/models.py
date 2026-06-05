from django.db import models
from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.
class Video(models.Model):
    QUALITY_CHOICES = [
        ('360p', '360p'),
        ('720p', '720p'),
        ('1080p', '1080p'),
    ]

    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    quality = models.CharField(max_length=5, choices=QUALITY_CHOICES)
    publishing_date = models.DateField()
    video_file = models.FileField(upload_to='videos/')
    thumbnail = models.FileField(upload_to='thumbnails/')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
 

def validate_video_size(value):
    if value.size > 500 * 1024 * 1024:
        raise ValidationError('Video file too large (max 500MB)')

class Video(models.Model):
    title = models.CharField(max_length=200)
    video_file = models.FileField(upload_to='videos/', validators=[validate_video_size])
    
    def clean(self):
        if len(self.title) < 3:
            raise ValidationError({'title': 'Title must be at least 3 characters'})
    
    def save(self, *args, **kwargs):
        self.full_clean()  # Runs validations before saving
        super().save(*args, **kwargs)



