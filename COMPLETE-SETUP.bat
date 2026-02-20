@echo off
REM ========================================
REM PriceX - Complete Android Setup
REM Run as Administrator
REM ========================================

echo.
echo ========================================
echo PriceX Android Complete Setup
echo ========================================
echo.

REM Check for admin rights
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Please run as Administrator
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

echo [1/5] Setting up Android SDK...

REM Set SDK path
set ANDROID_SDK_ROOT=C:\AndroidSDK
set ANDROID_HOME=%ANDROID_SDK_ROOT%
set PATH=%PATH%;%ANDROID_SDK_ROOT%\cmdline-tools\latest\bin;%ANDROID_SDK_ROOT%\platform-tools

if not exist "%ANDROID_SDK_ROOT%\cmdline-tools\latest\bin\sdkmanager.bat" (
    echo Downloading Android SDK command-line tools...
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}; Invoke-WebRequest -Uri 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip' -OutFile '%TEMP%\cmdline-tools.zip'"
    
    echo Extracting...
    mkdir "%ANDROID_SDK_ROOT%" 2>nul
    powershell -Command "Expand-Archive -Path '%TEMP%\cmdline-tools.zip' -DestinationPath '%ANDROID_SDK_ROOT%' -Force"
    
    mkdir "%ANDROID_SDK_ROOT%\cmdline-tools\latest" 2>nul
    move /y "%ANDROID_SDK_ROOT%\cmdline-tools\bin" "%ANDROID_SDK_ROOT%\cmdline-tools\latest\" 2>nul
    move /y "%ANDROID_SDK_ROOT%\cmdline-tools\lib" "%ANDROID_SDK_ROOT%\cmdline-tools\latest\" 2>nul
    move /y "%ANDROID_SDK_ROOT%\cmdline-tools\NOTICE.txt" "%ANDROID_SDK_ROOT%\cmdline-tools\latest\" 2>nul
    move /y "%ANDROID_SDK_ROOT%\cmdline-tools\source.properties" "%ANDROID_SDK_ROOT%\cmdline-tools\latest\" 2>nul
)

echo [2/5] Installing SDK components...
echo y | "%ANDROID_SDK_ROOT%\cmdline-tools\latest\bin\sdkmanager.bat" --sdk_root="%ANDROID_SDK_ROOT_ROOT%" --licenses 2>nul
"%ANDROID_SDK_ROOT%\cmdline-tools\latest\bin\sdkmanager.bat" --sdk_root="%ANDROID_SDK_ROOT%" "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo [3/5] Setting environment variables...
setx ANDROID_HOME "%ANDROID_SDK_ROOT%" /M
setx ANDROID_SDK_ROOT "%ANDROID_SDK_ROOT%" /M

echo [4/5] Installing npm dependencies...
cd /d "%~dp0PriceXMobile"
call npm install

echo [5/5] Building Android APK...
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
    echo [ERROR] Build failed. Try running Android Studio first.
)

pause
