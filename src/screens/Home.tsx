import { NavigationProp } from "@react-navigation/native";
import { Button, StyleSheet, View } from "react-native";

const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {
  return (
    <View style={styles.container}>
      <Button title="Escanear um produto" onPress={() => navigation.navigate("Scan")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
