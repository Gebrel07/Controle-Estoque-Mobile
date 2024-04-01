import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationProp } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
      <Text>
        Busque uma impressora através do <Text style={{ fontWeight: "bold" }}>Número de Série</Text>{" "}
        ou Escaneie um <Text style={{ fontWeight: "bold" }}>QR Code</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Digite um Número de Série"
        onChangeText={(text) => setSerialNumber(text)}
      />
      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Ionicons name="search-outline" size={20} color="white" />
        <Text style={{ color: "white" }}>Buscar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.qrCode} onPress={() => navigation.navigate("Scan")}>
        <Ionicons name="qr-code-outline" size={80} color="gray" />
        <Text style={{ textAlign: "center" }}>Clique aqui para Escanear</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",
    rowGap: 15,
    padding: 20,
  },
  input: {
    padding: 10,
    borderColor: "gray",
    textAlign: "center",
    borderBottomWidth: 1,
    color: "gray",
    width: "100%",
  },
  btn: {
    flexDirection: "row",
    columnGap: 10,
    backgroundColor: "gray",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    justifyContent: "center",
  },
  qrCode: {
    alignItems: "center",
    marginTop: 100,
  },
});

export default Home;
