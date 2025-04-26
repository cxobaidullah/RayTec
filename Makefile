android-build: metro-bundle
	cd android && ./gradlew assembleDebug && open ./app/build/outputs/apk/debug
metro-bundle:
	npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res