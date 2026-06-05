from django.db import models

# Create your models here.
class Videos(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    quality = models.CharField(max_length=50)
    published_date = models.DateField()
    file = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    views = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title  
