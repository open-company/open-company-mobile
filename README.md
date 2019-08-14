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

### Staging (Expo)

```
# Run this while `expo start` is running
expo publish --release-channel staging

# ...
# Uploading JavaScript bundles
# Published
# Your URL is

# https://exp.host/@your-expo-username/carrot-mobile?release-channel=staging
```

Now you can share this link with testers.

### Staging (TestFlight / Android Internal Testing)

```
# iOS
expo build:ios --release-channel staging

# Android
expo build:android --release-channel staging
```

These commands will run the build on the Expo build service. After a short while, a link will
be provided with the resuling .ipa/.apk artifact. These can then be uploaded to their respective
test services (TestFlight / Android Internal Testing) as usual.

### Prod

```
# iOS
expo build:ios --release-channel prod

# Android
expo build:android --release-channel prod
```

These commands will run the build on the Expo build service. After a short while, a link will
be provided with the resuling .ipa/.apk artifact. These can then be uploaded to their respective
app stores as usual.

You can find more information in the [Expo docs](https://docs.expo.io/versions/latest/distribution/app-stores/).