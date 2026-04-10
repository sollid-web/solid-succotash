#!/bin/bash
# Setup and run dev servers for WolvCapital

set -e

echo "🚀 Setting up WolvCapital dev environment..."

# Setup Node.js
export NODE_BIN="/tmp/node-v18.18.0-linux-x64/bin"
export PATH="$NODE_BIN:$PATH"

echo "📦 Node.js version: $(node -v)"
echo "📦 npm version: $(npm -v)"

# Setup Python venv
echo ""
echo "🐍 Setting up Python environment..."
cd /home/code/solid-succotash
if [ ! -d ".venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv .venv
fi

# Check if Django is installed
if ! /home/code/solid-succotash/.venv/bin/python -c "import django" 2>/dev/null; then
  echo "Installing Python dependencies..."
  /home/code/solid-succotash/.venv/bin/python -m pip install --upgrade pip setuptools wheel
  /home/code/solid-succotash/.venv/bin/python -m pip install -r requirements.txt
fi

echo ""
echo "✅ Environment setup complete!"
echo ""
echo "📍 To run dev servers, open 2 terminals and run:"
echo ""
echo "Terminal 1 (Backend):"
echo "  export PATH=\"/tmp/node-v18.18.0-linux-x64/bin:\$PATH\""
echo "  cd /home/code/solid-succotash"
echo "  source .venv/bin/activate"
echo "  python manage.py runserver 0.0.0.0:8000"
echo ""
echo "Terminal 2 (Frontend):"
echo "  export PATH=\"/tmp/node-v18.18.0-linux-x64/bin:\$PATH\""
echo "  cd /home/code/solid-succotash/frontend"
echo "  npm install --legacy-peer-deps"
echo "  npm run dev"
echo ""
echo "Then visit http://localhost:3000/checkout"
