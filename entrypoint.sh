#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8000}"
WEB_CONCURRENCY="${WEB_CONCURRENCY:-2}"
GUNICORN_TIMEOUT="${GUNICORN_TIMEOUT:-120}"

echo "🐳 Container starting (PORT=${PORT})"

# Wait for database readiness if DATABASE_URL is set.
if [[ -n "${DATABASE_URL:-}" ]]; then
	echo "🗄️  DATABASE_URL is set; waiting for DB..."
	for i in {1..30}; do
		if python manage.py check --database default > /dev/null 2>&1; then
			echo "✅ DB is reachable"
			break
		fi
		echo "⏳ DB not ready yet (attempt ${i}/30); sleeping 2s..."
		sleep 2
	done
fi

echo "📦 Running migrations..."
for i in {1..10}; do
	if python manage.py migrate --noinput; then
		echo "✅ Migrations complete"
		break
	fi
	echo "❌ Migration failed (attempt ${i}/10); retrying in 3s..."
	sleep 3
done

if [[ "${COLLECTSTATIC:-0}" == "1" ]]; then
	echo "📂 Collecting static files..."
	python manage.py collectstatic --noinput
else
	echo "⏭️  Skipping collectstatic (COLLECTSTATIC!=1)"
fi

if [[ "${SEED_PLANS:-0}" == "1" ]]; then
	echo "💰 Seeding investment plans..."
	python manage.py seed_plans
else
	echo "⏭️  Skipping seed_plans (SEED_PLANS!=1)"
fi

echo "🚀 Starting Gunicorn..."
exec gunicorn wolvcapital.wsgi:application \
	--bind "0.0.0.0:${PORT}" \
	--workers "${WEB_CONCURRENCY}" \
	--timeout "${GUNICORN_TIMEOUT}"
