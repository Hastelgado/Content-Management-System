from time import sleep
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.http import JsonResponse
from django.core.paginator import Paginator

from itertools import chain
from django.core.paginator import Paginator
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

import pandas as pd
from django.http import FileResponse

from .models import *

# Create your views here.

@login_required(login_url='login')
def index(request):

    return render(request, "mainapp/index.html", {

    })

def profile(request, person_id):
    currentuser = User.objects.get(id=request.user.id)
    person = Person.objects.get(id=person_id,user=currentuser)

    return render(request, "mainapp/profile.html", {
        "person":person,
    })

def search(request):
    currentuser = User.objects.get(id=request.user.id)
    searchtype = request.GET.get("searchtype")
    searchinput = request.GET.get("searchinput")

    if searchtype == 'name':
        results = Person.objects.filter(name__icontains=f'{searchinput}', user=currentuser)
    else:
        results = Person.objects.filter(location__icontains=f'{searchinput}', user=currentuser)

    return render(request, "mainapp/search.html", {
        "results":results,
    })

def download(request):
    # Logic to retrieve the file path or generate the file dynamically
    file_path = 'mainapp\Format Sample.xlsx'

    # Open the file using Python's built-in open() function
    file = open(file_path, 'rb')

    # Create a FileResponse object with the file and content type
    response = FileResponse(file)

    # Set the appropriate content disposition headers
    response['Content-Disposition'] = 'attachment; filename="Format Sample.xlsx"'

    # Return the FileResponse object as the HTTP response
    return response


def upload(request):
    currentuser = User.objects.get(id=request.user.id)

    if request.method == 'POST':
        myfile = request.FILES['file']
        df = pd.read_excel(myfile)
        try:
            first_row = df.iloc[0]
        except IndexError:
            return JsonResponse({"error": "Excel file format is incorrect."}, status=400)

        if 'Name' and 'Location' and 'Phone' in first_row:
            json_data = df.to_json(orient='records')
            json_data = json.loads(json_data)

            # List of persons
            persons = []

            for i in range(len(json_data)):
                person = json_data[i]

                name = person["Name"]
                phonenumber = person["Phone"]
                location = person["Location"]
                classification = person["Classification"]
                if classification == None:
                    classification = "-"
                googlemaps = person["Google Map"]
                if googlemaps == None:
                    googlemaps = "about:blank"
                parking = person["Parking"]
                if parking == None:
                    parking = "-"
                startdate = person["Start Date"]
                if startdate == None:
                    startdate = "-"
                enddate = person["End Date"]
                if enddate == None:
                    enddate = "-"
                starttime = person["Start Time"]
                if starttime == None:
                    starttime = "00:00"
                endtime = person["End Time"]
                if endtime == None:
                    endtime = "12:00"
                comments = person["Comments"]
                if comments == None:
                    comments = "None"

                # Check form integrity
                if phonenumber == "" or phonenumber == None or location == "" or location == None:
                    return JsonResponse({"error": f"A location or phonenumber field were left empty for '{name}'."}, status=400)
                elif name == "" or name == None:
                    return JsonResponse({"error": f"The name field was left empty in row '{i+2}'."}, status=400)

                # Add person to DB
                person = Person(name=name,phone=phonenumber,location=location,googlemaps=googlemaps,
                                parking=parking,startdate=startdate,enddate=enddate, classification=classification,
                                starttime=starttime,endtime=endtime,comments=comments,user=currentuser)
                persons.append(person)
            
            # Add the list of persons to DB
            Person.objects.bulk_create(persons)

            return JsonResponse({"message": "Excel file added successfully."}, status=201)
        else:
            return JsonResponse({"error": "Excel file format is incorrect."}, status=400)

        

################################### API Views ###################################

def getvisits(request,person_id):
    person = Person.objects.get(id=person_id)

    tabledata = Visit.objects.filter(person=person)

    visits = tabledata.order_by("-date").all()
    
    return JsonResponse([visit.serialize() for visit in visits], safe=False)


def addvisit(request):

    # Adding a new person must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    # Get person form data
    data = json.loads(request.body)

    personVisitedId = data.get("personVisitedId", "")
    date = data.get("date", "")
    note = data.get("note", "")

    person = Person.objects.get(id=personVisitedId)

    # Check form integrity
    if personVisitedId == "" or date == "" or note == "":
        return JsonResponse({"error": "Some necessary fields were left empty."}, status=400)
    
    # Add visit to DB
    visit = Visit(person=person, date=date, note=note)
    visit.save()

    return JsonResponse({"message": "Visit added successfully."}, status=201)


def getperson(request, person_id):
    currentuser = User.objects.get(id=request.user.id)
    person = Person.objects.get(id=person_id,user=currentuser)
    return JsonResponse(person.serialize(), safe=False)


def getpersons(request):
    currentuser = User.objects.get(id=request.user.id)
    tabledata = Person.objects.filter(user=currentuser)

    persons = tabledata.order_by("name").all()
    
    return JsonResponse([person.serialize() for person in persons], safe=False)

#def getpersons(request, page):
    currentuser = User.objects.get(id=request.user.id)
    tabledata = Person.objects.filter(user=currentuser)

    allpersons = tabledata.order_by("name").all()
    paginator = Paginator(allpersons, 20)
    page_number = page
    persons = paginator.get_page(page_number)

    data = {
        'persons': [person.serialize() for person in persons], # Convert objects to JSON
        'has_previous':persons.has_previous(),
        'has_next':persons.has_next(),
        'previous_page_number':persons.previous_page_number() if persons.has_previous() else None,
        'next_page_number':persons.next_page_number() if persons.has_next() else None,
        'number':persons.number,
        'num_pages':persons.paginator.num_pages,
    }

    # Return list of posts
    return JsonResponse(data, safe=False)

#def loadscroll(request, cycle):
    currentuser = User.objects.get(id=request.user.id)
    tabledata = Person.objects.filter(user=currentuser)

    allpersons = tabledata.order_by("name").all()
    paginator = Paginator(allpersons, 20)
    max_pages = paginator.num_pages
    persons = paginator.get_page(cycle)

    data = {
        'persons': [person.serialize() for person in persons], # Convert objects to JSON
        'has_next': persons.has_next()
    }

    sleep(1)
    # Return list of posts
    return JsonResponse(data, safe=False)


def addperson(request):
    currentuser = User.objects.get(id=request.user.id)

    # Adding a new person must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    # Get person form data
    data = json.loads(request.body)

    name = data.get("name", "")
    phonenumber = data.get("phonenumber", "")
    location = data.get("location", "")
    classification = data.get("classification", "")
    googlemaps = data.get("googlemaps", "")
    parking = data.get("parking", "")
    startdate = data.get("startdate", "")
    enddate = data.get("enddate", "")
    starttime = data.get("starttime", "")
    endtime = data.get("endtime", "")
    comments = data.get("comments", "")

    # Check form integrity
    if name == "" or phonenumber == "" or location == "":
        return JsonResponse({"error": "Some necessary fields were left empty."}, status=400)
    
    # Add person to DB
    person = Person(name=name,phone=phonenumber,location=location,googlemaps=googlemaps,
                    parking=parking,startdate=startdate,enddate=enddate, classification=classification,
                    starttime=starttime,endtime=endtime,comments=comments,user=currentuser)
    person.save()

    return JsonResponse({"message": "Person added successfully."}, status=201)


def editperson(request):
    currentuser = User.objects.get(id=request.user.id)

    # Adding a new person must be via PUT
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)
    
    # Get person form data
    data = json.loads(request.body)

    id = data.get("id", "")
    name = data.get("name", "")
    phonenumber = data.get("phonenumber", "")
    location = data.get("location", "")
    classification = data.get("classification", "")
    googlemaps = data.get("googlemaps", "")
    parking = data.get("parking", "")
    startdate = data.get("startdate", "")
    enddate = data.get("enddate", "")
    starttime = data.get("starttime", "")
    endtime = data.get("endtime", "")
    comments = data.get("comments", "")

    # Check form integrity
    if name == "" or phonenumber == "" or location == "":
        return JsonResponse({"error": "Some necessary fields were left empty."}, status=400)

    # Get the person to be edited
    person = Person.objects.get(id=id)
    
    # Edit person
    person.name=name
    person.phone=phonenumber
    person.location=location
    person.classification=classification
    person.googlemaps=googlemaps
    person.parking=parking
    person.startdate=startdate
    person.enddate=enddate
    person.starttime=starttime
    person.endtime=endtime
    person.comments=comments
    person.save()

    return JsonResponse(person.serialize(), safe=False)


def deleteperson(request):
    currentuser = User.objects.get(id=request.user.id)

    # Deleting a person must be via DELETE
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE request required."}, status=400)
    
    # Get person id
    data = json.loads(request.body)

    id = data.get("id", "")

    # Get person from DB and delete it
    person = Person.objects.get(id=id)
    person.delete()

    return JsonResponse({"message": "Person deleted successfully."}, status=201)


def deletevisit(request):
    currentuser = User.objects.get(id=request.user.id)

    # Deleting a visit must be via PUT
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE request required."}, status=400)
    
    # Get visit id
    data = json.loads(request.body)

    id = data.get("id", "")

    # Get person from DB and delete it
    visit = Visit.objects.get(id=id)
    visit.delete()

    return JsonResponse({"message": "Visit deleted successfully."}, status=201)


################################### Authentication Views ###################################

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "mainapp/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "mainapp/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "mainapp/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "mainapp/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "mainapp/register.html")
