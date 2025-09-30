# VisionExplorer Deployment Script (PowerShell)
# This script helps automate the deployment process for Windows

param(
    [switch]$SkipTests,
    [switch]$Force
)

# Colors for output
$Host.UI.RawUI.WindowTitle = "VisionExplorer Deployment"

function Write-Status {
    param($Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param($Message)
    Write-Host "ℹ $Message" -ForegroundColor Blue
}

Write-Host "🚀 VisionExplorer Deployment Helper" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (!(Test-Path "package.json") -or !(Test-Path "visionexplorer-frontend") -or !(Test-Path "visionexplorer-backend")) {
    Write-Error "Please run this script from the VisionExplorer root directory"
    exit 1
}

Write-Status "Found VisionExplorer project structure"

# Check git status
try {
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        Write-Warning "You have uncommitted changes"
        if (!$Force) {
            $response = Read-Host "Do you want to commit them? (y/n)"
            if ($response -eq "y" -or $response -eq "Y") {
                git add .
                git commit -m "Pre-deployment commit"
                Write-Status "Changes committed"
            } else {
                Write-Warning "Proceeding with uncommitted changes"
            }
        }
    }
} catch {
    Write-Warning "Could not check git status"
}

# Check for required files
Write-Host ""
Write-Host "📋 Checking deployment files..." -ForegroundColor Yellow

$requiredFiles = @(
    "vercel.json",
    "visionexplorer-backend/Dockerfile",
    "render.yaml",
    "visionexplorer-frontend/.env.example",
    "visionexplorer-backend/.env.example"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Status "$file exists"
    } else {
        Write-Error "$file is missing"
        exit 1
    }
}

# Check environment files
Write-Host ""
Write-Host "🔧 Checking environment configuration..." -ForegroundColor Yellow

if (!(Test-Path "visionexplorer-frontend/.env")) {
    Write-Warning "Frontend .env file not found"
    Write-Info "Copy visionexplorer-frontend/.env.example to visionexplorer-frontend/.env and configure it"
}

if (!(Test-Path "visionexplorer-backend/.env")) {
    Write-Warning "Backend .env file not found"
    Write-Info "Copy visionexplorer-backend/.env.example to visionexplorer-backend/.env and configure it"
}

# Check and install dependencies
Write-Host ""
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow

# Frontend dependencies
Set-Location "visionexplorer-frontend"
if (!(Test-Path "node_modules")) {
    Write-Info "Installing frontend dependencies..."
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Frontend dependencies installed"
    } else {
        Write-Error "Failed to install frontend dependencies"
        exit 1
    }
} else {
    Write-Status "Frontend dependencies already installed"
}

# Backend dependencies
Set-Location "../visionexplorer-backend"
if (!(Test-Path "node_modules")) {
    Write-Info "Installing backend dependencies..."
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Backend dependencies installed"
    } else {
        Write-Error "Failed to install backend dependencies"
        exit 1
    }
} else {
    Write-Status "Backend dependencies already installed"
}

Set-Location ".."

# Build frontend
Write-Host ""
Write-Host "🏗️ Building frontend..." -ForegroundColor Yellow
Set-Location "visionexplorer-frontend"
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Status "Frontend built successfully"
} else {
    Write-Error "Frontend build failed"
    exit 1
}
Set-Location ".."

# Test backend (if not skipped)
if (!$SkipTests) {
    Write-Host ""
    Write-Host "🧪 Testing backend..." -ForegroundColor Yellow
    Set-Location "visionexplorer-backend"
    try {
        npm test 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Backend tests passed"
        } else {
            Write-Warning "Backend tests failed or not available"
        }
    } catch {
        Write-Warning "Backend tests not available"
    }
    Set-Location ".."
}

# Git operations
Write-Host ""
Write-Host "📝 Preparing for deployment..." -ForegroundColor Yellow

try {
    # Commit any new changes
    git add .
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        git commit -m "Deployment preparation"
        Write-Status "Deployment files committed"
    }

    # Push to remote
    Write-Info "Pushing to GitHub..."
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Code pushed to GitHub"
    } else {
        Write-Warning "Failed to push to GitHub, continuing anyway"
    }
} catch {
    Write-Warning "Git operations failed, but continuing"
}

# Success message
Write-Host ""
Write-Host "🎉 Deployment Preparation Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Info "Next steps:"
Write-Host "1. Deploy frontend to Vercel:" -ForegroundColor White
Write-Host "   - Visit https://vercel.com" -ForegroundColor Gray
Write-Host "   - Import your GitHub repository" -ForegroundColor Gray
Write-Host "   - Set root directory to 'visionexplorer-frontend'" -ForegroundColor Gray
Write-Host "   - Add VITE_API_URL environment variable" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy backend to Render:" -ForegroundColor White
Write-Host "   - Visit https://render.com" -ForegroundColor Gray
Write-Host "   - Create new Web Service from GitHub" -ForegroundColor Gray
Write-Host "   - Set root directory to 'visionexplorer-backend'" -ForegroundColor Gray
Write-Host "   - Configure environment variables as per DEPLOYMENT.md" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Update URLs:" -ForegroundColor White
Write-Host "   - Set VITE_API_URL in Vercel to your Render backend URL" -ForegroundColor Gray
Write-Host "   - Set CORS_ORIGIN in Render to your Vercel frontend URL" -ForegroundColor Gray
Write-Host ""
Write-Status "See DEPLOYMENT.md for detailed instructions"

# Keep window open
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")