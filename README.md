# open-company-mobile

Thin Expo wrapper around the [open-company-web](https://github.com/open-company/open-company-web) project.

## Developing

You'll need a couple dependencies installed locally:

- [NodeJS](https://nodejs.org)
- [Expo](https://expo.io)
- [Yarn](https://yarnpkg.com)
- [Expo app](https://expo.io/tools) installed on your mobile device

Start your [local Carrot services](https://github.com/open-company) as usual, then:

```
yarn install # you only need to run this once

expo start
```

This will start an Expo development tunnel, and open a build status page in your browser. Scan
the QR code on that page with your mobile device to open the app within the Expo client.

## Deploying

### OTA Release (JS-only)

Changes to the `.js` code can be pushed to users over-the-air (OTA), and does not require
another release through the respective app store channels.

```
# Run this while `expo start` is running

expo publish --release-channel [staging | prod]

# ...
# Uploading JavaScript bundles
# Published
# Your URL is

# https://exp.host/@your-expo-username/carrot-mobile?release-channel=STAGE
```

Users with the app installed will autmoatically receive the update OTA.

### Native App Release

Changes to the native configuration (e.g. the icon, permissions, etc) will require an official release
through the respective app store channels for review.

```
# iOS
expo build:ios --release-channel staging

# Android
expo build:android --release-channel staging
```

These commands will run the build on the Expo build service. After a short while, a link will
be provided with the resulting .ipa/.apk artifact. These can then be uploaded to their respective
test services (TestFlight / Android Internal Testing) as usual.

### Push notifications certificates renewal

When Expo push attempts return an `InvalidCertificates` error we need to renew the push certificates.

- Log in on the [Apple Developer portal](https://developer.apple.com/)
- Go to the "Certificates, Identifiers & Profiles" section
- Click on Profiles on the left menu and remove the Distribution provisioning profile for iOS
- Go to Certificates and remove a iOS Distribution certificates (we can have only three and they are not app specific, can be reused for multiple apps)
- Go to the Keys section and remove the older key you can see

Finally, you just need to run Expo's re-new certificates command:

```console
# iOS
expo build:ios -c

# Android
expo build:android -c
```

And let Expo handle all the things!