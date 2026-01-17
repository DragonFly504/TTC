#!/bin/bash

# Django-Boilerplate setup
cd Django-Boilerplate
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver &
cd ..

# MERN-Boilerplate backend setup
cd MERN-Boilerplate/backend
npm install
npm start &
cd ../frontend

# MERN-Boilerplate frontend setup
npm install
npm start &

