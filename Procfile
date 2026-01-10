web: gunicorn wolvcapital.wsgi:application --log-file - --bind 0.0.0.0:${PORT} --workers ${WEB_CONCURRENCY:-2} --timeout 120
release: python manage.py migrate --noinput && python manage.py collectstatic --noinput
