import Ionicons from "@expo/vector-icons/Ionicons";
import { signOut } from "firebase/auth";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../firebase/config";

const Profile = () => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return <Text>Erro: usuário não autenticado</Text>;
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.displayName}>{currentUser.displayName}</Text>
        <Text style={{ textAlign: "center" }}>{currentUser.email}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => signOut(auth)}>
        <Ionicons name="exit-outline" size={20} color="gray" />
        <Text>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    rowGap: 15,
  },
  displayName: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 15,
  },
  btn: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    columnGap: 10,
  },
});
