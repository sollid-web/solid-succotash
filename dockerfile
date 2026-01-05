FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

# NOTE: Railway will prefer the Dockerfile CMD.
# Start Gunicorn directly (fast) so healthchecks can pass; run migrations/seeding
# via platform release phases or Render's start.sh (render.yaml uses that).
CMD ["bash", "-lc", "exec gunicorn wolvcapital.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers ${WEB_CONCURRENCY:-2} --timeout 120"]
