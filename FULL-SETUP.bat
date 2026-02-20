@echo off
REM ========================================
REM PriceX - Complete Setup & Deploy Script
REM ========================================
REM Run this to set up everything for PriceX

echo.
echo ========================================
echo PriceX Setup & Deployment
echo ========================================
echo.

REM ========================================
REM STEP 1: GitHub Authentication
REM ========================================
echo [STEP 1] GitHub Authentication
echo ----------------------------------------
gh auth login
if %errorlevel% neq 0 (
    echo [ERROR] GitHub login failed
    pause
    exit /b 1
)
echo [OK] GitHub authenticated

REM ========================================
REM STEP 2: Create GitHub Repository
REM ========================================
echo.
echo [STEP 2] Creating GitHub Repository
echo ----------------------------------------
gh repo create PriceX --public --source=. --push
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create repo
    pause
    exit /b 1
)
echo [OK] Repository created and code pushed

REM ========================================
REM STEP 3: Configure GitHub Secrets (Optional)
REM ========================================
echo.
echo [STEP 3] GitHub Secrets
echo ----------------------------------------
echo To enable full CI/CD and deployments, add these secrets in GitHub:
echo   - ANDROID_SIGNING_KEY
echo   - GOOGLE_PLAY_SERVICE_ACCOUNT  
echo   - APPSTORE_ISSUER_ID
echo   - AWS_ACCESS_KEY_ID
echo   - AWS_SECRET_ACCESS_KEY
echo.
echo Go to: https://github.com/settings/secrets
echo.

REM ========================================
REM STEP 4: Vercel Deployment (Optional)
REM ========================================
echo.
echo [STEP 4] Vercel Deployment
echo ----------------------------------------
vercel login
npx vercel --prod

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo What's next:
echo 1. GitHub Actions will build Android APK (~15 min)
echo 2. GitHub Actions will build iOS app (~20 min)
echo 3. Deploy website to Vercel
echo.
echo Check: https://github.com/YOUR_USERNAME/PriceX/actions
echo.

pause
