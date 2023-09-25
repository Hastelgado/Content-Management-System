from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<int:person_id>", views.profile, name="profile"),
    path("search", views.search, name="search"),
    path("upload", views.upload, name="upload"),
    path("download", views.download, name="download"),

    # API urls
    path("addperson", views.addperson, name="addperson"),
    path("getpersons", views.getpersons, name="getpersons"),
    path("getperson/<int:person_id>", views.getperson, name="getperson"),
    path("editperson", views.editperson, name="editperson"),
    path("deleteperson", views.deleteperson, name="deleteperson"),
    path("addvisit", views.addvisit, name="addvisit"),
    path("getvisits/<int:person_id>", views.getvisits, name="getvisits"),
    path("deletevisit", views.deletevisit, name="deletevisit"),

]
