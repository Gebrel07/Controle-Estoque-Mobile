import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import LoadingScreen from "../../components/LoadingScreen";
import { auth } from "../../firebase/config";
import useUser from "../../hooks/useUser";

const Signup = () => {
  interface DataInterface {
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const [data, setData] = useState<DataInterface>({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isPending, SetIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { addUser } = useUser();

  const validateFields = (): boolean => {
    const fields = [
      { name: "Nome", value: data.displayName },
      { name: "Email", value: data.email },
      { name: "Senha", value: data.password },
      { name: "Confirmar senha", value: data.confirmPassword },
    ];

    for (const field of fields) {
      if (field.value.length === 0) {
        setError(`${field.name} é obrigatório`);
        return false;
      }
    }

    if (data.confirmPassword !== data.password) {
      setError("Confirmação de senha incorreta");
      return false;
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
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.displayName });
      await addUser(userCredential.user.uid, data.displayName);
    } catch (err: any) {
      console.error(err);
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Endereço de email indisponível");
          break;
        case "auth/invalid-email":
          setError("Endereço de email inválido");
          break;
        case "auth/weak-password":
          setError("Senha muito fraca. Inclua no mínimo 6 caracteres");
          break;
        default:
          setError("Erro ao criar usuário");
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
        placeholder="Nome"
        onChangeText={(text) =>
          setData((prev) => {
            return { ...prev, displayName: text.trim() };
          })
        }
        value={data.displayName ? data.displayName : undefined}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        secureTextEntry={true}
        autoCapitalize="none"
        onChangeText={(text) =>
          setData((prev) => {
            return { ...prev, confirmPassword: text };
          })
        }
        value={data.confirmPassword ? data.confirmPassword : undefined}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
        <Text style={{ textAlign: "center", color: "white" }}>Criar conta</Text>
      </TouchableOpacity>
      {error && <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>}
    </View>
  );
};

export default Signup;

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
