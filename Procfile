web: gunicorn wolvcapital.wsgi:application --bind 0.0.0.0:${PORT} --workers ${WEB_CONCURRENCY:-2} --timeout 120
release: python manage.py migrate --noinput
