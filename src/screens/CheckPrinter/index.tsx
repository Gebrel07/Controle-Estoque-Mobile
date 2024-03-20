import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { usePrinterChecks } from "../../hooks/usePrinterChecks";

// types
import { Printer as PrinterInterface } from "../../types/firebaseModels";

// components
import Toast from "react-native-toast-message";
import Divider from "../../components/Divider";
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

  const [isPending, setIsPending] = useState<boolean>(false);
  const [printer, setPrinter] = useState<PrinterInterface | null>(null);

  // user input
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState<string | null>(null);

  const { addPrinterCheck, addCheckAccessory } = usePrinterChecks();

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
            .then((res) => {
              if (!res) {
                // TODO: handle cases where PrinterCheck is imcomplete because of
                // errors during this loop
                throw new Error(
                  "Erro ao adicionar PrinterCheckAccessory: " +
                    JSON.stringify({ printerCheckId, accessoryId })
                );
              }
            })
            .catch((err) => handleError(err));
        }
      })
      .catch((err) => handleError(err))
      .finally(() => {
        Toast.show({
          type: "success",
          text1: "Conferência enviada com sucesso!",
          position: "bottom",
          visibilityTime: 5000,
        });
        navigation.goBack();
      });
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PrinterCard serialNumber={serialNumber} onQueryDone={(printer) => setPrinter(printer)} />
      {printer && (
        <>
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
        </>
      )}
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
