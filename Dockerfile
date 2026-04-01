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

# Set default WEB_CONCURRENCY if not provided
ENV WEB_CONCURRENCY=${WEB_CONCURRENCY:-2}

CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py collectstatic --noinput && gunicorn wolvcapital.wsgi:application --bind 0.0.0.0:${PORT} --workers ${WEB_CONCURRENCY}"]
