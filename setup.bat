@echo off
REM VisionExplorer Setup Script for Windows
REM This script sets up the project for development and GitHub deployment

echo 🚀 VisionExplorer Setup Starting...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm and try again.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd visionexplorer-backend
npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd visionexplorer-frontend
npm install
cd ..

REM Create environment files if they don't exist
echo ⚙️ Setting up environment files...

if not exist "visionexplorer-backend\.env" (
    copy "visionexplorer-backend\.env.example" "visionexplorer-backend\.env"
    echo ✅ Created backend .env file
)

if not exist "visionexplorer-frontend\.env" (
    copy "visionexplorer-frontend\.env.example" "visionexplorer-frontend\.env"
    echo ✅ Created frontend .env file
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "visionexplorer-backend\tiles" mkdir "visionexplorer-backend\tiles"
if not exist "visionexplorer-backend\temp" mkdir "visionexplorer-backend\temp"

REM Check if tiles directory is empty
dir /b "visionexplorer-backend\tiles" 2>nul | findstr . >nul
if %errorlevel% neq 0 (
    echo 🎨 Generating test tiles...
    cd visionexplorer-backend
    npm run generate-tiles-simple
    cd ..
) else (
    echo ✅ Tiles directory already contains files
)

REM Check if git repository exists
if not exist ".git" (
    echo 🔧 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit: VisionExplorer project setup"
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

echo.
echo 🎉 Setup Complete!
echo.
echo 🚀 Next steps:
echo 1. To start development servers: npm run dev
echo 2. To start frontend only: cd visionexplorer-frontend ^&^& npm run dev
echo 3. To start backend only: cd visionexplorer-backend ^&^& npm run dev
echo.
echo 📡 Server URLs:
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:3000
echo.
echo 🔗 To push to GitHub:
echo 1. Create a new repository on GitHub
echo 2. git remote add origin ^<your-github-repo-url^>
echo 3. git branch -M main
echo 4. git push -u origin main

pause