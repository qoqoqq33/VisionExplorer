#!/bin/bash

# VisionExplorer Setup Script
# This script sets up the project for development and GitHub deployment

echo "🚀 VisionExplorer Setup Starting..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd visionexplorer-backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd visionexplorer-frontend
npm install
cd ..

# Create environment files if they don't exist
echo "⚙️ Setting up environment files..."

if [ ! -f "visionexplorer-backend/.env" ]; then
    cp visionexplorer-backend/.env.example visionexplorer-backend/.env
    echo "✅ Created backend .env file"
fi

if [ ! -f "visionexplorer-frontend/.env" ]; then
    cp visionexplorer-frontend/.env.example visionexplorer-frontend/.env
    echo "✅ Created frontend .env file"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p visionexplorer-backend/tiles
mkdir -p visionexplorer-backend/temp

# Generate test tiles if none exist
if [ ! "$(ls -A visionexplorer-backend/tiles 2>/dev/null)" ]; then
    echo "🎨 Generating test tiles..."
    cd visionexplorer-backend
    npm run generate-tiles-simple
    cd ..
else
    echo "✅ Tiles directory already contains files"
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: VisionExplorer project setup"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "🚀 Next steps:"
echo "1. To start development servers: npm run dev"
echo "2. To start frontend only: cd visionexplorer-frontend && npm run dev"
echo "3. To start backend only: cd visionexplorer-backend && npm run dev"
echo ""
echo "📡 Server URLs:"
echo "- Frontend: http://localhost:5173"
echo "- Backend: http://localhost:3000"
echo ""
echo "🔗 To push to GitHub:"
echo "1. Create a new repository on GitHub"
echo "2. git remote add origin <your-github-repo-url>"
echo "3. git branch -M main"
echo "4. git push -u origin main"