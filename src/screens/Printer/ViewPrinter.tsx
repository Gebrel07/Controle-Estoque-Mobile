import { RouteProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// types
import { Printer as PrinterInterface } from "../../types/firebaseModels";

// hooks
import { usePrinterInfos } from "../../hooks/usePrinterInfos";

// components
import PrinterAccessories from "./PrinterAccessories";
import PrinterInfos from "./PrinterInfos";

const ViewPrinter = ({ route }: { route: RouteProp<{ params: { serialNumber: string } }> }) => {
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [printer, setPrinter] = useState<PrinterInterface | null>(null);

  const { queryPrinterBySN } = usePrinterInfos();

  const { serialNumber }: { serialNumber: string } = route.params;

  useEffect(() => {
    queryPrinterBySN(serialNumber)
      .then((res) => {
        setPrinter(res);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao buscar impressora");
      })
      .finally(() => setIsPending(false));
  }, []);

  if (isPending) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
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

  if (printer === null) {
    return (
      <View style={styles.container}>
        <Text>Impressora não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PrinterInfos printer={printer} />
      <View style={styles.accessories}>
        <PrinterAccessories printerId={printer.id} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  accessories: {
    flex: 1,
    marginTop: 20,
  },
});

export default ViewPrinter;
