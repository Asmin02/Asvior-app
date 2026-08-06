# Android Upload Keystore Backup Guide

This project signs Android release bundles using local-only signing properties.

## Local files in use

- Keystore file (secret): android/keystore/upload-keystore.jks
- Signing properties (secret): android/keystore.properties

Both are ignored by git and must never be committed.

## Critical backup checklist

1. Copy android/keystore/upload-keystore.jks to at least 2 secure locations.
2. Save all signing values from android/keystore.properties in a password manager:
   - RELEASE_STORE_PASSWORD
   - RELEASE_KEY_ALIAS
   - RELEASE_KEY_PASSWORD
3. Store a recovery note with the app package name: com.asvior.app.
4. Restrict access to these secrets to trusted release maintainers only.

## Why this matters

If the upload keystore or passwords are lost, future updates for com.asvior.app cannot be signed with the same key and Play Store updates can be blocked.

## Restore on another machine

1. Place upload-keystore.jks at android/keystore/upload-keystore.jks.
2. Recreate android/keystore.properties with the same values.
3. Build with: gradlew bundleRelease
4. Verify with: jarsigner -verify -verbose -certs app/build/outputs/bundle/release/app-release.aab
