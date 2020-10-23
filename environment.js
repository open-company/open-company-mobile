/*****************************
TODO: potentially add this to .gitignore if it ever contains sensitive values
******************************/

import {default as Constants} from 'expo-constants'

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

const devWhitelistedOrigins = [
    ...whitelistedOrigins,
    "http://localhost",
    "http://192.168.0.5",
    "http://192.168.1.48",
];

const sentryConf = {sentryDSN: "https://bbf1b206b8654bc9914547da4abcb50c@o23653.ingest.sentry.io/5480224"};

const ENV = {
    dev: {
        debug: true,
        sentryEnvironment: "local",
        // Change this to your local development tunnel
        // webViewUrl: 'http://192.168.0.5:3559/login/desktop',
        webViewUrl: 'http://192.168.1.48:3559/login/desktop',
        // webViewUrl: 'https://staging.carrot.io/login/desktop',
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
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
    let localEnv;
    // What is __DEV__ ?
    // This variable is set to true when react-native is running in Dev mode.
    // __DEV__ is true when run locally, but false when published.
    if (__DEV__) {
        localEnv = ENV.dev;
    } else if (env === 'staging') {
        localEnv = ENV.staging;
    } else if (env === 'beta') {
        localEnv = ENV.beta;
    } else if (env === 'prod') {
        localEnv = ENV.prod;
    }
    return {...localEnv, ...sentryConf};
};

export default getEnvVars;