import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";

// types
import { Printer as PrinterInterface } from "../../types/firebaseModels";

// hooks
import { useCheckAccessories } from "../../hooks/useCheckAccessories";
import { usePrinterChecks } from "../../hooks/usePrinterChecks";
import { usePrinterInfos } from "../../hooks/usePrinterInfos";

// components
import Toast from "react-native-toast-message";
import Divider from "../../components/Divider";
import PrinterCardV2 from "../../components/PrinterCardV2";
import Checklist from "./Checklist";

const CheckPrinter = ({
  route,
  navigation,
}: {
  route: RouteProp<{ params: Record<string, any> }>;
  navigation: NavigationProp<any>;
}) => {
  const { serialNumber } = route.params;

  const [printer, setPrinter] = useState<PrinterInterface | null>(null);

  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // user input
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState<string | null>(null);

  const { queryPrinterBySN } = usePrinterInfos();
  const { addPrinterCheck, completePrinterCheck } = usePrinterChecks();
  const { addCheckAccessory } = useCheckAccessories();

  useEffect(() => {
    queryPrinterBySN(serialNumber)
      .then((printerQuery) => {
        setPrinter(printerQuery);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao buscar impressora");
      })
      .finally(() => {
        setIsPending(false);
      });
  });

  const finishPrinterCheck = (checkId: string) => {
    completePrinterCheck(checkId)
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Conferência realizada com sucesso!",
          position: "bottom",
          visibilityTime: 5000,
        });
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          type: "error",
          text1: "Erro ao completar conferência",
          position: "bottom",
          visibilityTime: 5000,
        });
      })
      .finally(() => navigation.goBack());
  };

  const handleError = (err: any) => {
    console.error(err);
    Toast.show({
      type: "error",
      text1: "Erro ao adicionar nova conferência",
      position: "bottom",
      visibilityTime: 5000,
    });
    navigation.goBack();
  };

  const handleSubmit = () => {
    if (!printer) {
      return null;
    }

    setIsPending(true);

    // create new printerCheck
    addPrinterCheck(printer.id, note)
      .then((printerCheckId) => {
        // create new PrinterCheckAccessory for each accessory
        for (const accessoryId of Object.keys(checks)) {
          addCheckAccessory(accessoryId, checks[accessoryId], printerCheckId)
            .then()
            .catch((err) => handleError(err));
        }
        // mark printerCheck as completed
        finishPrinterCheck(printerCheckId);
      })
      .catch((err) => handleError(err));
  };

  const handleTextChange = (text: string) => {
    const newText = text.trim();
    setNote(newText.length ? newText : null);
  };

  if (isPending) {
    return (
      <View style={styles.container}>
        <Text>Enviando...</Text>
      </View>
    );
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
      <PrinterCardV2 printer={printer} />
      <Checklist
        printerId={printer.id}
        onItemChecked={(id, checked) => {
          setChecks((prev) => {
            return { ...prev, [id]: checked };
          });
        }}
      />

      <Divider />

      <View>
        <Text style={styles.title}>Observação</Text>
        <TextInput
          style={styles.obs}
          multiline
          placeholder="Insira uma observação (opcional)"
          onChangeText={handleTextChange}
        />
      </View>
      <Button title="Enviar" onPress={handleSubmit} />
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
  obs: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    textAlign: "left",
  },
});
