from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    pass

    def __str__(self):
        return f"User-id:{self.id},   Name:{self.username}"
    

class Person(models.Model):
    name = models.CharField(max_length=50)
    phone = models.CharField(max_length=25)
    location = models.CharField(max_length=25)
    classification = models.CharField(max_length=25, default='-')
    googlemaps = models.URLField(default='about:blank')
    parking = models.CharField(max_length=25, default='-')
    starttime = models.TimeField(blank=True, null=True, default='00:00')
    endtime = models.TimeField(blank=True, null=True, default='12:00')
    startdate = models.CharField(max_length=25, default='-')
    enddate = models.CharField(max_length=25, default='-')
    comments = models.TextField(max_length=150, default='None')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_persons")
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "location": self.location,
            "classification": self.classification,
            "googlemaps": self.googlemaps,
            "visits": self.person_visits.count(),
            "parking": self.parking,
            "comments": self.comments,
            "startdate": self.startdate,
            "enddate": self.enddate,
            "user": self.user.username,
            "starttime": self.starttime,
            "endtime": self.endtime,
        }
    
    def __str__(self):
        return f"Person-id:{self.id},   name:{self.name}"

class Visit(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name="person_visits")
    date = models.DateTimeField()
    note = models.TextField(blank=True)

    def serialize(self):
        return {
            "id": self.id,
            "personVisited": self.person.name,
            "date": self.date,
            "note": self.note,
        }
    
    def __str__(self):
        return f"Visit-id:{self.id},   personVisited:{self.person.name},   date:{self.date}"