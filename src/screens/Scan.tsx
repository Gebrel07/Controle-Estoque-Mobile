import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

// components
import QrScanner from "../components/QrScanner";

const Scan = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [mountCamera, setMountCamera] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      // when screen is focused mount camera
      setMountCamera(true);

      return () => {
        // when unfocused unmount camera
        setMountCamera(false);
      };
    }, [])
  );

  const onBarCodeScanned = (serialNumber: string) => {
    navigation.navigate("ViewPrinter", { serialNumber });
  };

  const onPermissionDenied = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      {mountCamera && (
        <QrScanner onBarCodeScanned={onBarCodeScanned} onPermissionDenied={onPermissionDenied} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Scan;
