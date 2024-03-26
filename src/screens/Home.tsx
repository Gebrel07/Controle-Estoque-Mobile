import { NavigationProp } from "@react-navigation/native";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [serialNumber, setSerialNumber] = useState<string | null>(null);

  const handleSubmit = () => {
    if (serialNumber) {
      navigation.navigate("ViewPrinter", { serialNumber });
    } else {
      Toast.show({
        type: "error",
        text1: "Digite um Número de Série",
        position: "bottom",
        visibilityTime: 5000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite um Número de Série"
        onChangeText={(text) => setSerialNumber(text)}
      />
      <Button title="Buscar" onPress={handleSubmit} />
      <Text>Ou</Text>
      <Button title="Escanear QR Code" onPress={() => navigation.navigate("Scan")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    rowGap: 15,
  },
  input: {
    padding: 10,
    backgroundColor: "white",
    borderColor: "gray",
    textAlign: "center",
    borderBottomWidth: 2,
    color: "gray",
  },
});

export default Home;
