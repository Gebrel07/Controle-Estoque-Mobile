import { Camera, CameraType } from "expo-camera";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

const QrScanner = ({
  onBarCodeScanned,
  onPermissionDenied,
}: {
  onBarCodeScanned: (data: string) => any;
  onPermissionDenied: () => any;
}) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    if (!permission) {
      // if no permission, request it
      requestPermission()
        .then(({ granted }) => {
          if (granted === false) {
            // if permission is denied, call function
            onPermissionDenied();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={CameraType.back}
        onBarCodeScanned={(res) => onBarCodeScanned(res.data)}
      />
      <View style={styles.overlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 300,
    height: 300,
    marginTop: -150,
    marginLeft: -150,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    borderRadius: 10,
  },
});

export default QrScanner;
