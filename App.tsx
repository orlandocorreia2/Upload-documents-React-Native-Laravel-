import * as React from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {StyleSheet, View, Button, Alert} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';

export function App() {
  const handleDocumentPicker = React.useCallback(async () => {
    const pickerResult = await DocumentPicker.pick({
      presentationStyle: 'fullScreen',
      copyTo: 'cachesDirectory',
    });
    if (!pickerResult || !pickerResult.length || !pickerResult[0].fileCopyUri) {
      return;
    }
    const fileURI = pickerResult[0].fileCopyUri.replace('file:', '');
    let fileBase64 = '';
    RNFetchBlob.fs.readStream(fileURI, 'base64', 4095).then(ifstream => {
      ifstream.open();
      ifstream.onData(chunk => {
        fileBase64 += chunk;
      });
      ifstream.onError(err => {
        console.log('oops', err);
      });
      ifstream.onEnd(async () => {
        fileBase64 = `data:${pickerResult[0].name};base64,${fileBase64}`;
        const {
          data: {message},
        } = await axios.post('http://10.0.0.123:8888/upload/file', {
          document: fileBase64,
        });
        Alert.alert('Sucesso!', message);
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="open picker for single file selection"
        onPress={handleDocumentPicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
