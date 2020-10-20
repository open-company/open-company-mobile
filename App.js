import React from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { handleWebMessage, usePushNotificationHandler, useDeepLinkHandler, useColorSchemeHandler } from './src/nativeWebBridge';
import getEnvVars from './environment';
import { useColorScheme } from 'react-native-appearance';

const { webViewUrl, whitelistedOrigins } = getEnvVars();

const Colors = {
  background: '#FFFFFF'
};

export default function App() {
  const colorScheme = useColorScheme();
  const themeStatusBarStyle = colorScheme === 'light' ? 'light-content' : 'dark-content';

  usePushNotificationHandler(this, webViewUrl);
  useDeepLinkHandler(this, webViewUrl);
  useColorSchemeHandler(this, webViewUrl);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle={themeStatusBarStyle} />
      <WebView
        ref={r => (this.webref = r)}
        source={{ uri: webViewUrl }}
        originWhitelist={whitelistedOrigins}
        onMessage={(event) => handleWebMessage(this.webref, event)}
        decelerationRate="normal"
        // allowsBackForwardNavigationGestures="true"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});