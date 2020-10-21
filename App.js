import React from 'react';
import { StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { handleWebMessage, usePushNotificationHandler, useDeepLinkHandler, useColorSchemeHandler } from './src/nativeWebBridge';
import getEnvVars from './environment';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';

const { webViewUrl, whitelistedOrigins } = getEnvVars();

const Colors = {
  background: '#FFFFFF'
};

export default function App() {
  const colorScheme = useColorScheme(),
        webViewRef = React.useRef(null),
        themeStatusBarStyle = colorScheme === 'light' ? 'light-content' : 'dark-content';

  usePushNotificationHandler(webViewRef, webViewUrl);
  useDeepLinkHandler(webViewRef, webViewUrl);
  useColorSchemeHandler(webViewRef);

  return (
    <AppearanceProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.background} barStyle={themeStatusBarStyle} />
        <WebView
          ref={webViewRef}
          source={{ uri: webViewUrl }}
          originWhitelist={whitelistedOrigins}
          onMessage={(event) => handleWebMessage(webViewRef, event)}
          decelerationRate="normal"
          // allowsBackForwardNavigationGestures="true"
        />
      </SafeAreaView>
    </AppearanceProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});