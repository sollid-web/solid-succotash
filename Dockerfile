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

# Collect static files AT BUILD TIME
RUN python manage.py collectstatic --noinput

CMD ["sh", "-c", "gunicorn wolvcapital.wsgi:application --bind 0.0.0.0:${PORT}"]
