#!/bin/bash
# Start Next.js frontend dev server on port 3000

echo "🚀 Starting Next.js frontend server..."
echo "Frontend available at: http://localhost:3000"
echo "Checkout page: http://localhost:3000/checkout"
echo ""

cd /home/code/solid-succotash/frontend

# Ensure Node.js is in PATH
export PATH="/tmp/node-v18.18.0-linux-x64/bin:$PATH"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing npm dependencies (first run)..."
  npm install --legacy-peer-deps
fi

# Start dev server
npm run dev
