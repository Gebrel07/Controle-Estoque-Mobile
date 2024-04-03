import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";

// types
import { CheckedAccessory } from "../../types/accessoryTypes";
import { Printer } from "../../types/printerTypes";

// hooks
import { useCheckAccessories } from "../../hooks/useCheckAccessories";
import { usePrinterChecks } from "../../hooks/usePrinterChecks";
import { usePrinter } from "../../hooks/usePrinter";

// components
import Toast from "react-native-toast-message";
import CustomButton from "../../components/CustomButton";
import LoadingScreen from "../../components/LoadingScreen";
import PrinterCard from "../../components/PrinterCard";
import Checklist from "./Checklist";

const CheckPrinter = ({
  route,
  navigation,
}: {
  route: RouteProp<{ params: Record<string, any> }>;
  navigation: NavigationProp<any>;
}) => {
  const { serialNumber } = route.params;

  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [printer, setPrinter] = useState<Printer | null>(null);
  const [accessories, setAccessories] = useState<CheckedAccessory[] | null>(null);

  const [note, setNote] = useState<string | null>(null);

  const { queryPrinterBySN } = usePrinter();
  const { addPrinterCheck, completePrinterCheck } = usePrinterChecks();
  const { addCheckAccessory, queryAccessoriesForCheck } = useCheckAccessories();

  useEffect(() => {
    queryPrinterBySN(serialNumber)
      .then((printerQuery) => {
        setPrinter(printerQuery);
        if (printerQuery) {
          queryAccessoriesForCheck(printerQuery.id)
            .then((accessoriesForcheck) => {
              setAccessories(accessoriesForcheck);
            })
            .catch((err) => {
              console.error(err);
              setError("Erro ao buscar acessórios");
            })
            .finally(() => {
              setIsPending(false);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao buscar impressora");
      });
  }, []);

  const handlePress = (accessoryId: string, hasAccessory: boolean) => {
    if (!accessories) {
      return null;
    }

    setAccessories(
      accessories.map((accessory) => {
        if (accessory.id === accessoryId) {
          return { ...accessory, hasAccessory: hasAccessory };
        } else {
          return accessory;
        }
      })
    );
  };

  const handleTextChange = (text: string) => {
    const newText = text.trim();
    setNote(newText.length ? newText : null);
  };

  const createPrinterCheck = async (
    printer: Printer,
    note: string | null,
    accessories: CheckedAccessory[] | null
  ) => {
    const res: { completed: boolean; error: string | null } = { completed: true, error: null };

    let newPrinterCheckId;
    try {
      newPrinterCheckId = await addPrinterCheck(printer.id, note);
    } catch (err) {
      console.error(err);
      res.completed = false;
      res.error = "Erro ao adicionar nova conferência";
      return res;
    }

    if (!accessories) {
      return res;
    }

    try {
      for (const accessory of accessories) {
        await addCheckAccessory(accessory.id, accessory.hasAccessory, newPrinterCheckId);
      }
    } catch (err) {
      console.error(err);
      res.completed = false;
      res.error = "Erro ao adicionar acessórios à conferência";
      return res;
    }

    try {
      await completePrinterCheck(newPrinterCheckId);
    } catch (err) {
      console.error(err);
      res.completed = false;
      res.error = "Erro ao finalizar conferência";
    }

    return res;
  };

  const handleSubmit = () => {
    if (!printer) {
      return;
    }

    setIsPending(true);

    createPrinterCheck(printer, note, accessories)
      .then((res) => {
        if (res.completed) {
          Toast.show({
            type: "success",
            text1: "Conferência realizada com sucesso!",
            position: "bottom",
            visibilityTime: 5000,
          });
        } else {
          Toast.show({
            type: "error",
            text1: res.error ? res.error : "Houve um erro inesperado",
            position: "bottom",
            visibilityTime: 5000,
          });
        }
        navigation.goBack();
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao iniciar criação de conferência");
      });
  };

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!printer) {
    return (
      <View style={styles.container}>
        <Text>Impressora não encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PrinterCard printer={printer} />
      <Checklist accessories={accessories} onAccessoryPress={handlePress} />
      <View style={styles.obsContainer}>
        <Text style={styles.title}>Observação</Text>
        <TextInput
          style={styles.obs}
          multiline
          placeholder="Insira uma observação (opcional)"
          onChangeText={handleTextChange}
        />
      </View>
      <CustomButton title="Enviar" iconName="send-sharp" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default CheckPrinter;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    rowGap: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  obsContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  obs: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    textAlign: "left",
  },
});
