/*****************************
TODO: potentially add this to .gitignore if it ever contains sensitive values
******************************/

import { Constants } from "expo";
import { Platform } from "react-native";

const ENV = {
    dev: {
        // Change this to your local development tunnel
        webViewUrl: 'http://192.168.0.5:3559/login/desktop'
    },
    staging: {
        webViewUrl: 'https://staging.carrot.io/login/desktop'
    },
    beta: {
        webViewUrl: 'https://carrot.io/login/desktop'
    },
    prod: {
        webViewUrl: 'https://carrot.io/login/desktop'
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