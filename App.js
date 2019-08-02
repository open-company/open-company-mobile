import React from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import { WebView } from 'react-native-webview';

const Colors = {
  background: '#FBFAF7'
};

export default function App() {
  // Setup native -> mobile side of the bridge (see oc.web.expo ns in open-company-web)
  const initializeBridgeEventQueue = `
    try {
      if (window.oc) {
        oc.web.expo.setup_bridge();
      }
    } catch (error) { alert(error); }
    true;
  `;

  // Handles the web -> native side of the bridge (see oc.web.expo ns in open-company-web)
  const handleWebMessage = (event) => {
    const { op, data } = JSON.parse(event.nativeEvent.data);
    switch (op) {
      case 'log':
        console.log(data);
        break;
      case 'web-ready':
        console.log('Carrot web is ready to receive native events');
        break;
    }
  };

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
        source={{ uri: 'http://192.168.0.5:3559/login/desktop' }}
        style={{ marginTop: 30 }}
        injectedJavaScript={initializeBridgeEventQueue}
        onMessage={handleWebMessage}
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
