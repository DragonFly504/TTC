from django.shortcuts import render
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse
from django.template.loader import render_to_string


def home(request):
    return render(request, 'index.html')

def tracking(request):
    tracking_number = request.GET.get('q', '')
    return render(request, 'tracking.html', {'tracking_number': tracking_number})

def signup(request):
    return render(request, 'signup.html')

def signin(request):
    return render(request, 'signin.html')

def dashboard(request):
    return render(request, 'dashboard.html')


def test_email(request):
    to = request.GET.get('to') or getattr(settings, 'DEFAULT_FROM_EMAIL', None)
    if not to:
        return HttpResponse('No recipient configured. Set DEFAULT_FROM_EMAIL in settings or pass ?to=', status=400)
    
    subject = 'Test Email from TTC Worldwide'
    try:
        message = render_to_string('test_email.txt', {'recipient': to})
    except Exception:
        message = f'Test email to {to}'
    
    try:
        send_mail(
            subject,
            message,
            getattr(settings, 'DEFAULT_FROM_EMAIL', settings.EMAIL_HOST_USER),
            [to],
            fail_silently=False,
        )
    except Exception as e:
        return HttpResponse(f'Email send failed: {e}', status=500)
    
    return HttpResponse(f'Email sent to {to}', content_type='text/plain')
