# PriceX Mobile Build Guide

## Prerequisites

### Windows - Android Studio
1. Download Android Studio: https://developer.android.com/studio
2. Run the installer
3. During installation, make sure "Android SDK" is selected
4. After install, open Android Studio → Configure → SDK Manager
5. Install required SDK components:
   - Android SDK Platform (API 34)
   - Build Tools
   - Android SDK Command-line Tools

### Mac - Xcode
1. Install Xcode from App Store
2. Run `sudo xcode-select --install` to install command line tools
3. CocoaPods will be installed via npm

## Environment Variables

After Android Studio installation, set:
```
ANDROID_HOME=C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
```

## Build Commands

### Android (Windows)
```cmd
cd PriceXMobile
npm install
cd android
gradlew.bat assembleDebug
```

APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### iOS (Mac only)
```bash
cd PriceXMobile
npm install
cd ios
pod install
xcodebuild -workspace PriceXMobile.xcworkspace -scheme PriceXMobile -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 15' build
```

Or use the provided script:
```bash
chmod +x ../build-ios.sh
../build-ios.sh
```

## Quick Start Scripts

- `BUILD-MOBILE.bat` - Build Android APK (run after installing Android Studio)
- `build-ios.sh` - Build iOS app (run on Mac with Xcode)

## Troubleshooting

### Java not found
Install JDK 17 from: https://adoptium.net/

### ANDROID_HOME not set
```cmd
setx ANDROID_HOME "C:\Users\YourName\AppData\Local\Android\Sdk"
```

### Gradle issues
Delete `android/.gradle` and `android/app/build` folders and rebuild.

## Output Files

- **Android APK**: `PriceXMobile/android/app/build/outputs/apk/debug/app-debug.apk`
- **iOS App**: Built in Xcode, located in DerivedData folder
