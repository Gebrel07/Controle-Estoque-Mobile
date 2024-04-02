import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

// components
import Toast from "react-native-toast-message";
import QrScanner from "./QrScanner";

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
    navigation.navigate("PrinterStack", { screen: "ViewPrinter", params: { serialNumber } });
  };

  const onPermissionDenied = () => {
    navigation.navigate("PrinterStack", { screen: "Home" });
    Toast.show({
      type: "info",
      text1: "Permita acesso à camera",
      text2: "O scaner precisa de acesso à sua camera.",
      position: "bottom",
      visibilityTime: 5000,
    });
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
