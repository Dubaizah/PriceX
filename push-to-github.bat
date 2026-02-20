@echo off
REM PriceX GitHub Push Script
REM Run this to push to GitHub

echo ========================================
echo PriceX GitHub Push Script
echo ========================================
echo.

REM Check if GitHub CLI is installed
where gh >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] GitHub CLI not found. Installing...
    winget install GitHub.cli --accept-package-agreements --accept-source-agreements
)

echo Please authenticate with GitHub:
gh auth login

echo.
echo Creating repository on GitHub...
gh repo create PriceX --public --source=. --push

echo.
echo ========================================
echo SUCCESS: PriceX pushed to GitHub!
echo ========================================
echo.
echo CI/CD will now:
echo - Build Android APK
echo - Build iOS app
echo - Run tests

pause
