#!/usr/bin/env bash
set -e

# DB migrations + static collection each deploy
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Start Gunicorn
exec gunicorn wolvcapital.wsgi:application --bind 0.0.0.0:8000
