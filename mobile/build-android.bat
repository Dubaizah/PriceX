@echo off
REM PriceX Mobile Build Script for Windows
REM Run this script to build Android APK

echo ========================================
echo PriceX Mobile Build Script
echo ========================================
echo.

REM Check prerequisites
echo Checking prerequisites...

REM Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18+
    exit /b 1
)
echo [OK] Node.js found

REM Check Java
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java not found. Please install JDK 17+
    exit /b 1
)
echo [OK] Java found

REM Navigate to mobile directory
cd /d "%~dp0mobile"

REM Install dependencies
echo.
echo Installing dependencies...
call npm install

REM Build Android Debug APK
echo.
echo Building Android Debug APK...
cd android
call gradlew.bat assembleDebug

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [SUCCESS] Android APK built successfully!
    echo ========================================
    echo.
    echo APK Location: android\app\build\outputs\apk\debug\app-debug.apk
) else (
    echo.
    echo [ERROR] Build failed
    exit /b 1
)

pause
