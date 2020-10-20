import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Clipboard } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as firebase from "firebase";
export default function scanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
async function handleQuery({ type, data }) { //query database with qr string to retrieve user fields to contact them
  let details = await firebase
    .firestore()
    .collection("users")
    .doc(data.toString())
    .get()
    .then(doc => {

      return [doc.data().email, doc.data().phone, doc.data().name];
    });
    setScanned(true); //set scannedState to be true
    Clipboard.setString(details.toString()); //copy details to clipboard
    alert(
      `Name: ${details[2]}\nPhone: ${details[1]}\nEmail: ${details[0]}\nThese details have been copied to your clipboard`
    );

  return details;
}
const handleBarCodeScanned = ({ type, data }) => {    //constant for details so firebase will resolve its promises 
  let details = handleQuery(data);
  
};

  if (hasPermission === null) {                             //checking for camera permissions
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end"
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleQuery}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}
