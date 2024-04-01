import { NavigationProp } from "@react-navigation/native";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { auth } from "../../firebase/config";

const ResetPassword = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [isPending, SetIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!email) {
      setError("Email é obrigatório");
      return;
    }

    SetIsPending(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Toast.show({
        type: "info",
        text1: "Link para redefinição de senha enviado",
        text2: "Verifique o seu email",
        position: "bottom",
        visibilityTime: 5000,
      });
      navigation.navigate("Login");
    } catch (err: any) {
      console.error(err);
      setError("Erro ao enviar email de redefinição de senha");
    } finally {
      SetIsPending(false);
    }
  };

  if (isPending) {
    return (
      <View>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
        value={email ? email : undefined}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
        <Text style={{ textAlign: "center", color: "white" }}>Enviar</Text>
      </TouchableOpacity>
      {error && <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>}
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    rowGap: 15,
    borderRadius: 5,
    flex: 1,
  },
  input: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    padding: 10,
  },
  submitBtn: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
  },
});
