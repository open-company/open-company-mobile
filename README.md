# [OpenCompany](https://github.com/open-company) Mobile

[![AGPL License](http://img.shields.io/badge/license-AGPL-blue.svg?style=flat)](https://www.gnu.org/licenses/agpl-3.0.en.html)

## Background

> You have to be transparent so you no longer cast a shadow but instead let the light pass through you.

> -- Kamand Kojouri

Teams struggle to keep everyone on the same page. People are hyper-connected in the moment with chat and email, but it gets noisy as teams grow, and people miss key information. Everyone needs clear and consistent leadership, and the solution is surprisingly simple and effective - **great leadership updates that build transparency and alignment**.

With that in mind we designed [Carrot](https://carrot.io/), a software-as-a-service application powered by the open source [OpenCompany platform](https://github.com/open-company) and a source-available [web UI](https://github.com/open-company/open-company-web).

With Carrot, important company updates, announcements, stories, and strategic plans create focused conversations that keep everyone aligned without interruptions. When information is shared transparently, it inspires trust, new ideas and new levels of stakeholder engagement. Carrot makes it easy for leaders to engage with employees, investors, and customers, creating alignment for everyone.

Transparency expectations are changing. Organizations need to change as well if they are going to attract and retain savvy teams, investors and customers. Just as open source changed the way we build software, transparency changes how we build successful companies with information that is open, interactive, and always accessible. Carrot turns transparency into a competitive advantage.

To get started, head to: [Carrot](https://carrot.io/)

## Overview

This is a thin [Expo](https://expo.io/) wrapper around the [OpenCompany Web](https://github.com/open-company/open-company-web) project.

## Developing

You'll need a couple dependencies installed locally:

- [NodeJS](https://nodejs.org)
- [Expo](https://expo.io)
- [Yarn](https://yarnpkg.com)
- [Expo app](https://expo.io/tools) installed on your mobile device

Start your [local OpenCompany services](https://github.com/open-company) as usual, then:

```console
yarn install # you only need to run this once

expo start
```

This will start an Expo development tunnel, and open a build status page in your browser. Scan the QR code on that page with your mobile device to open the app within the Expo client.

## Debug from device or simulator/emulator

You can debug the expo webview with react-devtools. You need to install react-devtools as global package:

```console
npx install -g react-devtools
```

Install the [React DevTools extentions](https://docs.expo.io/workflow/debugging/#debugging-with-react-devtools) for Chrome if you haven't already (this is also).

Then start the dev tools gui with:

```console
react-devtools
```

and then start this project, then open the app (if from simulator/emulator use the left side pane of the expo page that opens when you start this, if device open expo app etc).
Once inside the app you need to shake it vertically to show the hidden Expo menu and then tap on Start remote debugging.

Remember the shake gesture to disable it as it's pretty annoying having all these pages opening automatically when you don't need remote debug.

Bring the [debuger ui page](http://localhost:19001/debugger-ui) in foreground and start debugging it.

NB: on the client site there is a script injection that needs to be added before ReactDOM is required. The script is injected only if you have this environment variable set:

```console
export REACT_NATIVE_DEVTOOLS_URL="http://localhost:8097"
```

More info on debugging Expo applications can be found [here](https://docs.expo.io/workflow/debugging/#debugging-with-react-devtools)

## Deploying

### OTA Release (JS-only)

Changes to the `.js` code can be pushed to users over-the-air (OTA), and does not require another release through the respective app store channels.

```console
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

You need the following values in your env to build the app for staging or production:

export GA_API_KEY="..."
export OC_MOBILE_GH_AUTH_TOKEN="..."

You can find GA_API_KEY (also known as Firebase apiKey from OC's GA account), and you can get a github auth token from github account settings, more info [here](https://docs.sentry.io/product/releases/#install-repo-integration)

Also do not forget to increment the buildVersion value every time you create a new build for TestFlight or staging testing. And change the app version when you are ready to release.

Changes to the native configuration (e.g. the icon, permissions, etc) will require an official release through the respective app store channels for review.

```console
# iOS
expo build:ios --release-channel staging

# Android
expo build:android --release-channel staging
```

These commands will run the build on the Expo build service. After a short while, a link will be provided with the resulting .ipa/.apk artifact. These can then be uploaded to their respective test services (TestFlight / Android Internal Testing) as usual.

### AppStore and Google play release

To release to the store you need to bump `version` in the app.js file and also (required by Google Play) bump the `versionCode` and `buildNumber`. For the latter we use even numbers for production releases and odd numbers for staging releases.

Once all versions has been bumped you can run:

```console
# iOS
expo build:ios --release-channel prod

# Android
expo build:android --release-channel prod
```

Now download the IPA and APK files from the links you get from the command above and upload the files.

For iOS you need to log in to https://developer.apple.com and go the your apps and create a new app version, set the release date to a future date (1 year from now) so the app won't be released automatically when it gets approved but it will wait for our click.
Then you need Xcode version 10.3 or older since it includes the Application Loader utility app that you can use to upload the IPA file. Open Application Loader, log in with your credential and drop in the IPA file.
Then go to AppStore Connect again, select the build you just upload and submit it for review. Reply NO to the encryption question and follow [this](https://docs.expo.io/versions/latest/distribution/app-stores/#ios-specific-guidelines) and [this](https://segment.com/docs/sources/mobile/ios/quickstart/#step-5-submitting-to-the-app-store) for the IFDA question.
:tada: you are done!

For Android you need to go to the Google Play console and go to the release section. Create a new release and upload the APK file in the dedicated section and :tada:.

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


## Participation

Please note that this project is released with a [Contributor Code of Conduct](https://github.com/open-company/open-company-mobile/blob/mainline/CODE-OF-CONDUCT.md). By participating in this project you agree to abide by its terms.


## License

Distributed under the [GNU Affero General Public License Version 3](https://www.gnu.org/licenses/agpl-3.0.en.html).

Copyright © 2020 OpenCompany, LLC.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the [GNU Affero General Public License](https://www.gnu.org/licenses/agpl-3.0.en.html) for more details.
