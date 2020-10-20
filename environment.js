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

const ENV = {
    dev: {
        // Change this to your local development tunnel
        // webViewUrl: 'http://192.168.0.5:3559/login/desktop',
        webViewUrl: 'http://192.168.1.48:3559/login/desktop',
        // webViewUrl: 'https://staging.carrot.io/login/desktop',
        whitelistedOrigins: devWhitelistedOrigins,
    },
    staging: {
        webViewUrl: 'https://staging.carrot.io/login/desktop',
        whitelistedOrigins,
    },
    beta: {
        webViewUrl: 'https://carrot.io/login/desktop',
        whitelistedOrigins,
    },
    prod: {
        webViewUrl: 'https://carrot.io/login/desktop',
        whitelistedOrigins,
    }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
    // What is __DEV__ ?
    // This variable is set to true when react-native is running in Dev mode.
    // __DEV__ is true when run locally, but false when published.
    if (__DEV__) {
        return ENV.dev;
    } else if (env === 'staging') {
        return ENV.staging;
    } else if (env === 'beta') {
        return ENV.beta;
    } else if (env === 'prod') {
        return ENV.prod;
    }
};

export default getEnvVars;