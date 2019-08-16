import React from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { handleWebMessage, usePushNotificationHandler } from './src/nativeWebBridge';
import getEnvVars from './environment';

const { webViewUrl } = getEnvVars();

const Colors = {
  background: '#FBFAF7'
};

export default function App() {
  usePushNotificationHandler(this);

  /*
   * Inject "flag" object for mobile app detection
   */
  const runFirst = `
    document.OCCarrotMobile = {};
    true;
  `;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <WebView
        ref={r => (this.webref = r)}
        source={{ uri: webViewUrl }}
        style={{ marginTop: 30 }}
        onMessage={(event) => handleWebMessage(this.webref, event)}
        injectedJavaScript={runFirst}
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