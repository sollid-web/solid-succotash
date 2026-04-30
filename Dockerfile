FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# MOVE COLLECTSTATIC TO BUILD STAGE
# This ensures static files are ready before the container ever starts
RUN python manage.py collectstatic --noinput

# OPTIMIZED START COMMAND
# We remove collectstatic and keep migrate (or move migrate to a Railway 'Pre-deploy' setting)
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn wolvcapital.wsgi:application --bind 0.0.0.0:${PORT} --timeout 120 --workers 2"]