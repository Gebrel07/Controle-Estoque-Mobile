import { RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";

// types
import { Printer as PrinterInterface } from "../../types/firebaseModels";

// components
import Divider from "../../components/Divider";
import PrinterCard from "../../components/PrinterCard";
import Checklist from "./Checklist";

const CheckPrinter = ({ route }: { route: RouteProp<{ params: Record<string, any> }> }) => {
  const { serialNumber } = route.params;
  const [printer, setPrinter] = useState<PrinterInterface | null>(null);

  // user input
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [obs, setObs] = useState<string | null>(null);

  const handleSubmit = () => {
    // TODO: send request to firebase to add a new printer check
    console.log(checks);
    console.log(obs);
  };

  const handleTextChange = (text: string) => {
    const newText = text.trim();
    setObs(newText.length ? newText : null);
  };

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
