@echo off
REM ========================================
REM PriceX Mobile Build Script
REM Requires: Android Studio installed
REM ========================================

echo.
echo ========================================
echo PriceX Mobile Build
echo ========================================
echo.

REM Check if Android Studio is installed
if exist "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" (
    set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
    echo [OK] Android SDK found: %ANDROID_HOME%
) else (
    echo [WARNING] Android SDK not found in default location
    echo Please install Android Studio from: https://developer.android.com/studio
    echo.
    echo After installation, make sure ANDROID_HOME is set
)

REM Check Java
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java not found. Please install JDK 17+
    exit /b 1
)
echo [OK] Java found

REM Set ANDROID_HOME if not set
if not defined ANDROID_HOME (
    set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
)

echo.
echo Using ANDROID_HOME: %ANDROID_HOME%
echo.

REM Navigate to mobile project
cd /d "%~dp0PriceXMobile"

REM Install npm dependencies
echo Installing npm dependencies...
call npm install

REM Build Android Debug APK
echo.
echo Building Android Debug APK...
cd android
call gradlew.bat assembleDebug

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo APK: android\app\build\outputs\apk\debug\app-debug.apk
) else (
    echo.
    echo [ERROR] Build failed
    exit /b 1
)

pause
