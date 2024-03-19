import { NavigationProp, RouteProp } from "@react-navigation/native";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// types
import { Printer as PrinterInterface } from "../types/firebaseModels";

// components
import PrinterCard from "../components/PrinterCard";

const ViewPrinter = ({
  route,
  navigation,
}: {
  route: RouteProp<{ params: Record<string, any> }>;
  navigation: NavigationProp<any>;
}) => {
  const { serialNumber } = route.params;

  const [printer, setPrinter] = useState<PrinterInterface | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PrinterCard
        serialNumber={serialNumber}
        onQueryDone={(printer) => setPrinter(printer)}
        onError={() => setError("Erro ao carregar impressora")}
      />
      {printer && (
        <View style={styles.buttons}>
          <Button
            title="Realizar conferência"
            onPress={() => navigation.navigate("CheckPrinter", { serialNumber })}
          />
          <Button title="Histórico de conferências" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    rowGap: 20,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  buttons: {
    rowGap: 10,
    minWidth: "100%",
  },
});

export default ViewPrinter;
