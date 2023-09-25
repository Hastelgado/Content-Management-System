# Content Management System

This is a data entry/management system that I built for a dental company to streamline client data collection, storage, and retrieval processes.

## Distinctiveness and Complexity:
- The app has been designed around collecting the data of people with a specific profession (Doctors, in this case)
- The app has multiple ways of data entry including single entries and whole Excel file sheet entries.
- A specific Excel file format has been tailor made to fit the app's usage and make the user experience clear and straightforward.
- The Excel file format has been made downloadable in 1 click with the ability to upload the file back after entering the data.
- The user experience was prioritized on the front-end using Asynchronous/Fetch Javascript to use the least amount of page refreshing necessary.
- I designed a RESTful API for my app's backend to enable easy communication between the backend and frontend.
- I implemented full CRUDS functionality
- The app was built upon a mobile responsive frontend using Bootstrap while retaining full functionality in all features.
- Multiple models were used in the database using Django's relational system.

## Files of the project:
- The name of app I created in the Django project was "mainapp" folder.
- I created a virtual environment for my app in the venv folder which contains all of the libraries used.
- The static\mainapp folder contains the single JS script and CSS sheet I used for the app.
- The templates \mainapp folder contains the 6 HTML pages used in the app.
- The models.py contains the models designed for the ORM database.
- The urls.py contains the mapped URLs for the app, while differentiating them between regular and API.
- The views.py contains all of the functions and scripts used to design the backend functionality/RESTful API.
- The "Format Sample.xlsx" is the Excel Format file available for download on the website.
- The requirements.txt file contains all the necessary libraries to run the app.

## How to run the app:
- Create a virtual environment for the app by running "python -m venv venv", and click "yes" if prompted by your editor if you wish to use this Venv for the current workspace folder.
- Activate the New Virtual Environment: venv\Scripts\activate
- Install Required Packages: pip install -r requirements.txt
- Then simply start the app by running "python manage.py runserver".
- Note: You might have to uninstall some packages and reinstall them if app won't start. Your terminal should point them out for you.

Thank you for your time!
