@echo off
REM ========================================
REM PriceX Android SDK Setup
REM ========================================

echo.
echo Setting up Android SDK...
echo.

REM Set SDK location
set ANDROID_SDK_ROOT=C:\AndroidSDK
set ANDROID_HOME=%ANDROID_SDK_ROOT%
mkdir "%ANDROID_SDK_ROOT%" 2>nul

REM Download command line tools
echo Downloading Android SDK command-line tools...
powershell -Command "Invoke-WebRequest -Uri 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip' -OutFile '%ANDROID_SDK_ROOT%\cmdline-tools.zip'"

REM Extract
echo Extracting...
powershell -Command "Expand-Archive -Path '%ANDROID_SDK_ROOT%\cmdline-tools.zip' -DestinationPath '%ANDROID_SDK_ROOT%' -Force"

REM Move to correct location
if not exist "%ANDROID_SDK_ROOT%\cmdline-tools\latest" (
    mkdir "%ANDROID_SDK_ROOT%\cmdline-tools\latest"
    move /y "%ANDROID_SDK_ROOT%\cmdline-tools\*" "%ANDROID_SDK_ROOT%\cmdline-tools\latest\" 2>nul
)

echo.
echo Installing SDK components...
"%ANDROID_SDK_ROOT%\cmdline-tools\latest\bin\sdkmanager.bat" --sdk_root="%ANDROID_SDK_ROOT%" --licenses
"%ANDROID_SDK_ROOT%\cmdline-tools\latest\bin\sdkmanager.bat" --sdk_root="%ANDROID_SDK_ROOT%" "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo.
echo ========================================
echo Android SDK Setup Complete!
echo ========================================
echo ANDROID_HOME=%ANDROID_HOME%
echo.

REM Set environment variables permanently
setx ANDROID_HOME "%ANDROID_SDK_ROOT%"
setx ANDROID_SDK_ROOT "%ANDROID_SDK_ROOT%"

pause
