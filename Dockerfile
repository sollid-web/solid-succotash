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

# NOTE: Railway will prefer the Dockerfile CMD.
# Start Gunicorn directly (fast) so healthchecks can pass; run migrations/seeding
# via platform release phases or Render's start.sh (render.yaml uses that).
CMD ["sh", "-c", "gunicorn wolvcapital.wsgi:application --bind 0.0.0.0:${PORT}"]
