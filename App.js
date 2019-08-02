import React from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { handleWebMessage } from './src/nativeWebBridge';

const Colors = {
  background: '#FBFAF7'
};

export default function App() {

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <WebView
        ref={r => (this.webref = r)}
        source={{ uri: 'http://192.168.0.5:3559/login/desktop' }}
        style={{ marginTop: 30 }}
        onMessage={(event) => handleWebMessage(this.webref, event)}
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