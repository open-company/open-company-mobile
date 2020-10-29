/*********************
* You need the following values in your env to build for staging or production:
*
* export GA_API_KEY="..."
* export OC_MOBILE_GH_AUTH_TOKEN="..."
*
* You can find GA_API_KEY (also known as Firebase apiKey from OC's GA account), and you can get a github auth token from your own account
***********************/

import {default as Constants} from 'expo-constants';

const whitelistedOrigins = [
    "https://carrot.io",
    "https://*.carrot.io",
    "https://www.filestackapi.com",
    "https://static.filestackapi.com",
    "https://www.dropbox.com",
    "https://login.live.com",
    "https://www.box.com",
    "https://*.youtube.com",
    "https://*.loom.com",
    "https://*.useloom.com",
    "https://*.appcues.com",
    "https://*.vimeo.com",
    "https://js.stripe.com",
    "https://m.stripe.network",
    "https://*.doubleclick.net",
];

const localDevHost = process.env.LOCAL_DEV_HOST || "localhost";
const localDevPort = process.env.LOCAL_DEV_PORT || "3559";

const devWhitelistedOrigins = [
    ...whitelistedOrigins,
    `http://${localDevHost}`
];

const version = "1.3.0";
const buildVersion = 23;

export default {
  name: "Carrot",
  version: version,
  slug: "carrot-mobile",
  scheme: "carrot",
  description: "Asynchronous communication for teams",
  privacy: "public",
  sdkVersion: "39.0.0",
  githubUrl: "https://github.com/open-company/open-company-mobile",
  platforms: [
    "ios",
    "android"
  ],
  orientation: "portrait",
  primaryColor: "#6833F1",
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  notification: {
    icon: "./assets/android-notification-icon.png"
  },
  userInterfaceStyle: "automatic",
  hooks: {
    postPublish: [
      {
        file: "sentry-expo/upload-sourcemaps",
        config: {
          organization: "opencompany",
          project: "open-company-mobile",
          authToken: process.env.OC_MOBILE_GH_AUTH_TOKEN
        }
      }
    ]
  },
  web: {
    config: {
      firebase: {
        apiKey: process.env.GA_API_KEY,
        measurementId: "1:577193868724:android:802be8d5557ad8ad1606e1"
      }
    }
  },
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#FBFAF7"
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "io.carrot.mobile",
    buildNumber: buildVersion.toString(),
    icon: "./assets/ios-icon.png"
  },
  android: {
    package: "io.carrot.mobile",
    versionCode: buildVersion,
    permissions: [],
    icon: "./assets/android-icon.png"
  },
  // All values in extra will be passed to your app.
  extra: {
    envs: {
      dev: {
        debug: true,
        sentryEnvironment: "local",
        // Change this to your local development tunnel
        webViewUrl: `http://${localDevHost}:${localDevPort}/login/desktop`,
        whitelistedOrigins: devWhitelistedOrigins,
      },
      staging: {
        debug: true,
        sentryEnvironment: "staging",
        webViewUrl: 'https://staging.carrot.io/login/desktop',
        whitelistedOrigins,
      },
      beta: {
        debug: false,
        sentryEnvironment: "beta",
        webViewUrl: 'https://carrot.io/login/desktop',
        whitelistedOrigins,
      },
      prod: {
        debug: false,
        sentryEnvironment: "production",
        webViewUrl: 'https://carrot.io/login/desktop',
        whitelistedOrigins,
      }
    },
    sentryDSN: "https://bbf1b206b8654bc9914547da4abcb50c@o23653.ingest.sentry.io/5480224"
  }
};