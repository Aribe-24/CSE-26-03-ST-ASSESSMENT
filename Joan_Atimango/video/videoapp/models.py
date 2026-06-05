from django.db import models

class Video(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)  # optional
    video_file = models.FileField(upload_to='videos/')
    thumb_nail = models.FileField(upload_to='thumbnails/')  # ✅ FileField instead of ImageField
    QUALITY_CHOICES = [
        ('360p', '360p'),
        ('720p', '720p'),
        ('1080p', '1080p'),
    ]
    quality = models.CharField(max_length=10, choices=QUALITY_CHOICES)
    date_of_publishing = models.DateField()  # user chooses date

    def __str__(self):
        return self.title
