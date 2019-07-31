import React from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import { WebView } from 'react-native-webview';

const Colors = {
  background: '#FBFAF7'
};

export default function App() {
  const initializeBridgeEventQueue = `
    oc.web.expo.setup_bridge();
    true;
  `;

  const enqueueEvent = `
    document.getElementById('app').dispatchEvent(
      new CustomEvent('expoEvent', {detail: {someValue: 'hello'}})
    );
    true;
  `;

  setTimeout(() => {
    this.webref.injectJavaScript(enqueueEvent);
  }, 10000);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <WebView
        ref={r => (this.webref = r)}
        injectedJavaScript={initializeBridgeEventQueue}
        source={{ uri: 'http://192.168.0.5:3559/login/desktop' }}
        style={{ marginTop: 30 }}
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
