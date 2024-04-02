import { NavigationProp } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import LoadingScreen from "../../components/LoadingScreen";
import { auth } from "../../firebase/config";

const Login = ({ navigation }: { navigation: NavigationProp<any> }) => {
  interface DataInterface {
    email: string;
    password: string;
  }

  const [data, setData] = useState<DataInterface>({
    email: "",
    password: "",
  });

  const [isPending, SetIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateFields = (): boolean => {
    const fields = [
      { name: "Email", value: data.email },
      { name: "Senha", value: data.password },
    ];

    for (const field of fields) {
      if (field.value.length === 0) {
        setError(`${field.name} é obrigatório`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    setError(null);

    if (!validateFields()) {
      return;
    }

    SetIsPending(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (err: any) {
      console.error(err);
      switch (err.code) {
        case "auth/invalid-credential":
          setError("Email ou Senha inválidos");
          break;
        default:
          setError("Erro ao realizar login");
      }
    } finally {
      SetIsPending(false);
    }
  };

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={(text) =>
          setData((prev) => {
            return { ...prev, email: text.trim() };
          })
        }
        value={data.email ? data.email : undefined}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry={true}
        autoCapitalize="none"
        onChangeText={(text) =>
          setData((prev) => {
            return { ...prev, password: text };
          })
        }
        value={data.password ? data.password : undefined}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
        <Text style={{ textAlign: "center", color: "white" }}>Entrar</Text>
      </TouchableOpacity>
      {error && <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>}

      <View style={{ rowGap: 20, marginTop: 15 }}>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={{ textAlign: "center" }}>Criar conta</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          <Text style={{ textAlign: "center" }}>Esqueci minha sehna</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

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
