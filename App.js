import * as Sentry from 'sentry-expo';
import React from 'react';
import { StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { handleWebMessage, usePushNotificationHandler, useDeepLinkHandler, useColorSchemeHandler } from './src/nativeWebBridge';
import { default as getEnvVars } from './environment';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';

console.log("DBG getEnvVars", getEnvVars());

const { webViewUrl, whitelistedOrigins, sentryDSN, sentryEnvironment, debug } = getEnvVars();

Sentry.init({
  dsn: sentryDSN,
  enableInExpoDevelopment: true,
  environment: sentryEnvironment,
  debug: debug, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

const Colors = {
  lightBackgroundColor: '#FBFAF9',
  darkBackgroundColor: '#1B202A'
};

const styles = {
  light: {
    bgColor: Colors.lightBackgroundColor,
    statusBarStyle: 'dark-content',
    style: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: Colors.lightBackgroundColor,
      }
    })
  },
  dark: {
    bgColor: Colors.darkBackgroundColor,
    statusBarStyle: 'light-content',
    style: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: Colors.darkBackgroundColor,
      }
    })
  }
};

function Carrot() {
  const colorScheme = useColorScheme() || 'light',
        webViewRef = React.useRef(null),
        themedStyle = styles[colorScheme];;

  usePushNotificationHandler(webViewRef, webViewUrl);
  useDeepLinkHandler(webViewRef, webViewUrl);
  useColorSchemeHandler(webViewRef);

  return (
    <SafeAreaView style={themedStyle.style.container}>
      <StatusBar backgroundColor={themedStyle.bgColor} barStyle={themedStyle.statusBarStyle} />
      <WebView
        ref={webViewRef}
        source={{ uri: webViewUrl }}
        originWhitelist={whitelistedOrigins}
        onMessage={(event) => handleWebMessage(webViewRef, event)}
        decelerationRate="normal"
        // allowsBackForwardNavigationGestures="true"
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppearanceProvider>
      <Carrot/>
    </AppearanceProvider>
  );
}