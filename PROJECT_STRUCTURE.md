# TTC Project Structure - Properly Organized

## Root Level
```
TTC/
├── Django-Boilerplate/          # Django Backend App
├── MERN-Boilerplate/            # MERN Stack (React + Node)
├── docker-compose.prod.yml      # Production Docker setup
├── docker-compose.yml           # Development Docker setup
├── nginx.prod.conf              # Production Nginx config
├── deploy.sh                    # Deployment script
├── .env.example                 # Environment template
└── README.md                    # Project info
```

## Django Structure (Django-Boilerplate/)
```
Django-Boilerplate/
├── manage.py                    # Django management
├── requirements.txt             # Dev dependencies
├── requirements.prod.txt        # Production dependencies
├── Dockerfile                   # Dev Dockerfile
├── Dockerfile.prod              # Production Dockerfile
├── tracking_site/               # Main Django project
│   ├── settings.py              # Django settings
│   ├── urls.py                  # URL routing
│   ├── wsgi.py                  # WSGI app
│   └── asgi.py                  # ASGI app
├── tracking/                    # Tracking app
│   ├── models.py                # Database models
│   ├── views.py                 # Views/logic
│   ├── urls.py                  # App URLs
│   ├── utils.py                 # Utilities
│   └── migrations/              # Database migrations
├── accounts/                    # Accounts app (optional)
│   ├── views.py
│   └── urls.py
├── templates/                   # HTML templates
│   ├── index.html
│   ├── Dashbord.html
│   ├── Signin.html
│   ├── Signup.html
│   └── Tracking.html
├── static/                      # Static files (CSS, JS, Images)
│   ├── css/
│   ├── js/
│   └── images/
└── staticfiles/                 # Collected static files (auto-generated)
```

## MERN Backend Structure (MERN-Boilerplate/backend/)
```
MERN-Boilerplate/backend/
├── server.js                    # Express entry point
├── package.json                 # Dependencies
├── .env.example                 # Environment template
├── Dockerfile                   # Docker config
├── controllers/                 # Request handlers
│   ├── authController.js
│   └── trackingController.js
├── models/                      # Database schemas
│   ├── user.js
│   └── Tracking.js
├── routes/                      # API routes
│   ├── authRoutes.js
│   └── trackingRoutes.js
└── utils/                       # Utilities
    └── sendEmail.js
```

## MERN Frontend Structure (MERN-Boilerplate/frontend/)
```
MERN-Boilerplate/frontend/
├── package.json                 # Dependencies
├── .env.example                 # Environment template
├── Dockerfile                   # Docker config
├── public/
│   └── index.html               # Main HTML file
└── src/
    ├── index.js                 # React entry point
    ├── App.js                   # Main component
    ├── App.css                  # Global styles
    ├── index.css                # Global styles
    ├── components/              # Reusable components
    │   ├── AdminDashboard.js
    │   └── Home.js
    ├── pages/                   # Page components
    └── services/                # API services
        └── api.js
```

## Configuration Files Location
- `.env.example` → Root level (for Django)
- `MERN-Boilerplate/backend/.env.example` → Backend env
- `MERN-Boilerplate/frontend/.env.example` → Frontend env

## Docker Compose Setup
- Production: `docker-compose.prod.yml` → Uses PostgreSQL, Gunicorn
- Development: `docker-compose.yml` → Uses SQLite, dev servers

## Key Points
1. ✅ All dependencies in `package.json` and `requirements.txt`
2. ✅ All source code organized by app/feature
3. ✅ Templates separate from static files
4. ✅ Environment configs in `.env.example` files
5. ✅ Docker configs in root and service directories
6. ✅ Deployment scripts in root level
