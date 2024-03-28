import { NavigationProp, RouteProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// hooks
import { useCheckAccessories } from "../../hooks/useCheckAccessories";
import { usePrinterChecks } from "../../hooks/usePrinterChecks";
import { usePrinterInfos } from "../../hooks/usePrinterInfos";

// types
import { CheckedAccessory } from "../../types/accessoryTypes";
import { Printer, PrinterCheck } from "../../types/printerTypes";

// components
import PrinterCard from "../../components/PrinterCard";
import LastCheckCard from "./LastCheckCard";

const ViewPrinter = ({
  route,
  navigation,
}: {
  route: RouteProp<{ params: Record<string, any> }>;
  navigation: NavigationProp<any>;
}) => {
  const { serialNumber } = route.params;

  const [printer, setPrinter] = useState<Printer | null>(null);

  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [lastCheck, setLastCheck] = useState<PrinterCheck | null>(null);
  const [checkAccessories, setCheckAccessories] = useState<CheckedAccessory[] | null>(null);

  const { queryPrinterBySN } = usePrinterInfos();
  const { queryLastPrinterCheck } = usePrinterChecks();
  const { queryCheckAccessoriesAndData } = useCheckAccessories();

  useEffect(() => {
    const fetchData = async () => {
      let printerQuery: Printer | null;
      try {
        printerQuery = await queryPrinterBySN(serialNumber);
        if (!printerQuery) {
          return null;
        }
        setPrinter(printerQuery);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar impressora");
        return null;
      }

      let lasCheckQuery: PrinterCheck | null;
      try {
        lasCheckQuery = await queryLastPrinterCheck(printerQuery.id);
        if (!lasCheckQuery) {
          return null;
        }
        setLastCheck(lasCheckQuery);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar última conferência");
        return null;
      }

      let checkAccessoriesQuery: CheckedAccessory[] | null;
      try {
        checkAccessoriesQuery = await queryCheckAccessoriesAndData(lasCheckQuery.id);
        setCheckAccessories(checkAccessoriesQuery);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar acessórios");
      }
    };

    fetchData().then(() => setIsPending(false));
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

      {lastCheck && <LastCheckCard printerCheck={lastCheck} accessories={checkAccessories} />}

      <View style={styles.buttons}>
        {/* TODO: use printerId instead? */}
        <Button
          title="Realizar conferência"
          onPress={() => navigation.navigate("CheckPrinter", { serialNumber })}
        />
        <Button
          title="Histórico de conferências"
          onPress={() => navigation.navigate("CheckHistory", { printerId: printer.id })}
        />
      </View>
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
