@echo off
cd Django-Boilerplate
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
start python manage.py runserver
cd ..
cd MERN-Boilerplate\backend
npm install
start npm start
cd ..\frontend
npm install
start npm start
