import React from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { handleWebMessage, usePushNotificationHandler, useDeepLinkHandler } from './src/nativeWebBridge';
import getEnvVars from './environment';

const { webViewUrl, whitelistedOrigins } = getEnvVars();

const Colors = {
  background: '#FFFFFF'
};

export default function App() {
  usePushNotificationHandler(this);
  useDeepLinkHandler(this, webViewUrl);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <WebView
        ref={r => (this.webref = r)}
        source={{ uri: webViewUrl }}
        originWhitelist={whitelistedOrigins}
        style={{ marginTop: 30 }}
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