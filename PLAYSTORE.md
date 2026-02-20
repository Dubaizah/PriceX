# PriceX - Google Play Store Submission Guide

## Release APK Ready!

**APK Location:** `pricex/PriceX-release.apk` (47.5 MB)

## What's Included
- Android APK with bundled JavaScript
- Signed with debug keystore (for testing)
- Ready for Play Store upload

## To Publish on Google Play Store

### 1. Create Google Play Developer Account
1. Go to: https://play.google.com/console/developers
2. Pay $25 one-time fee
3. Create your developer profile

### 2. Create New App
1. Click **Create App**
2. Fill in:
   - App name: **PriceX**
   - Default language: English
   - App type: Android App
   - Free or Paid: Free

### 3. Upload APK
1. Go to **Release > Production**
2. Click **Create new release**
3. Upload `PriceX-release.apk`
4. Add release notes

### 4. App Listing Details
Fill in:
- **Title:** PriceX - AI Price Comparison
- **Short description:** AI-powered global price comparison platform
- **Full description:** [Use the content from README]
- **Screenshots:** Add 2-8 screenshots (1080x1920 or 2560x1440)
- **App icon:** 512x512 PNG
- **Feature graphic:** 1024x500 PNG
- **Privacy Policy:** Required (can use a generated one)

### 5. Content Rating
1. Go to **Content rating**
2. Complete the questionnaire
3. Get your content rating certificate

### 6. Pricing & Distribution
1. Set as **Free**
2. Select countries
3. Agree to terms

### 7. Submit for Review
Click **Submit for review**

---

## For Production Release (Recommended)

### Generate Your Own Keystore
```bash
keytool -genkey -v -keystore pricex.keystore -alias pricex -keyalg RSA -keysize 2048 -validity 10000 -storepass YOUR_PASSWORD -keypass YOUR_PASSWORD
```

### Update build.gradle
```groovy
signingConfigs {
    release {
        storeFile file("pricex.keystore")
        storePassword "YOUR_PASSWORD"
        keyAlias "pricex"
        keyPassword "YOUR_PASSWORD"
    }
}
```

Then rebuild:
```bash
./gradlew assembleRelease
```

---

## Keystore Information (Testing Only)

**For this debug build:**
- Keystore: `PriceXMobile/android/app/debug.keystore`
- Alias: pricex
- Password: android

**⚠️ IMPORTANT:** For production, generate a new keystore and keep it safe!

---

## App Information

- **Package Name:** com.pricexapp
- **Version:** 1.0.0
- **Min SDK:** 24 (Android 7.0)
- **Target SDK:** 35

## Features to Highlight in Play Store
- AI Price Predictions
- Price History Charts
- Deal Score Algorithm
- Cashback Program (10,000+ stores)
- Voice Search
- Compare Products
- 18 Currencies Support
- 12 Languages (including RTL)
