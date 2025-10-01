# -------- Base image --------
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PATH="/root/.local/bin:${PATH}"

WORKDIR /app

# System deps (psycopg2-binary usually OK, but libpq is small)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# -------- Python deps --------
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# -------- App code --------
COPY . /app

# Entrypoint to run migrations + collectstatic + gunicorn
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the gunicorn port
EXPOSE 8000

# Healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
 CMD curl -fsS http://127.0.0.1:8000/ || exit 1

# Start
CMD ["/entrypoint.sh"]
