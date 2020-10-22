import React from 'react';
import { StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { handleWebMessage, usePushNotificationHandler, useDeepLinkHandler, useColorSchemeHandler } from './src/nativeWebBridge';
import getEnvVars from './environment';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';

const { webViewUrl, whitelistedOrigins } = getEnvVars();

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