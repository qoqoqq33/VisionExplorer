#!/bin/bash

# VisionExplorer Deployment Script
# This script helps automate the deployment process

set -e

echo "🚀 VisionExplorer Deployment Helper"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "visionexplorer-frontend" ] || [ ! -d "visionexplorer-backend" ]; then
    print_error "Please run this script from the VisionExplorer root directory"
    exit 1
fi

print_status "Found VisionExplorer project structure"

# Check if git repository is clean
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes"
    read -p "Do you want to commit them? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Pre-deployment commit"
        print_status "Changes committed"
    else
        print_warning "Proceeding with uncommitted changes"
    fi
fi

# Check for required files
echo
echo "📋 Checking deployment files..."

required_files=(
    "vercel.json"
    "visionexplorer-backend/Dockerfile"
    "render.yaml"
    "visionexplorer-frontend/.env.example"
    "visionexplorer-backend/.env.example"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "$file exists"
    else
        print_error "$file is missing"
        exit 1
    fi
done

# Check environment files
echo
echo "🔧 Checking environment configuration..."

if [ ! -f "visionexplorer-frontend/.env" ]; then
    print_warning "Frontend .env file not found"
    print_info "Copy visionexplorer-frontend/.env.example to visionexplorer-frontend/.env and configure it"
fi

if [ ! -f "visionexplorer-backend/.env" ]; then
    print_warning "Backend .env file not found"
    print_info "Copy visionexplorer-backend/.env.example to visionexplorer-backend/.env and configure it"
fi

# Check dependencies
echo
echo "📦 Checking dependencies..."

cd visionexplorer-frontend
if [ ! -d "node_modules" ]; then
    print_info "Installing frontend dependencies..."
    npm install
    print_status "Frontend dependencies installed"
else
    print_status "Frontend dependencies already installed"
fi

cd ../visionexplorer-backend
if [ ! -d "node_modules" ]; then
    print_info "Installing backend dependencies..."
    npm install
    print_status "Backend dependencies installed"
else
    print_status "Backend dependencies already installed"
fi

cd ..

# Build frontend
echo
echo "🏗️ Building frontend..."
cd visionexplorer-frontend
npm run build
print_status "Frontend built successfully"
cd ..

# Test backend
echo
echo "🧪 Testing backend..."
cd visionexplorer-backend
npm test 2>/dev/null || print_warning "Backend tests not available or failed"
cd ..

# Git status
echo
echo "📝 Preparing for deployment..."

# Make sure everything is committed
git add .
if [ -n "$(git status --porcelain)" ]; then
    git commit -m "Deployment preparation"
    print_status "Deployment files committed"
fi

# Push to remote
print_info "Pushing to GitHub..."
git push origin main
print_status "Code pushed to GitHub"

echo
echo "🎉 Deployment Preparation Complete!"
echo "=================================="
echo
print_info "Next steps:"
echo "1. Deploy frontend to Vercel:"
echo "   - Visit https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Set root directory to 'visionexplorer-frontend'"
echo "   - Add VITE_API_URL environment variable"
echo
echo "2. Deploy backend to Render:"
echo "   - Visit https://render.com"
echo "   - Create new Web Service from GitHub"
echo "   - Set root directory to 'visionexplorer-backend'"
echo "   - Configure environment variables as per DEPLOYMENT.md"
echo
echo "3. Update URLs:"
echo "   - Set VITE_API_URL in Vercel to your Render backend URL"
echo "   - Set CORS_ORIGIN in Render to your Vercel frontend URL"
echo
print_status "See DEPLOYMENT.md for detailed instructions"