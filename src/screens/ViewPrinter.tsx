import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// hooks
import { useCheckAccessories } from "../hooks/useCheckAccessories";
import { usePrinter } from "../hooks/usePrinter";
import { usePrinterChecks } from "../hooks/usePrinterChecks";

// types
import { CheckedAccessory } from "../types/accessoryTypes";
import { Printer, PrinterCheck } from "../types/printerTypes";

// components
import Card from "../components/Card";
import CustomButton from "../components/CustomButton";
import LoadingScreen from "../components/LoadingScreen";
import PrinterCard from "../components/PrinterCard";
import PrinterCheckCardBody from "../components/PrinterCheckCardBody";

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

  const { queryPrinterBySN } = usePrinter();
  const { queryLastPrinterCheck } = usePrinterChecks();
  const { queryCheckAccessoriesWithdData } = useCheckAccessories();

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
        checkAccessoriesQuery = await queryCheckAccessoriesWithdData(lasCheckQuery.id);
        setCheckAccessories(checkAccessoriesQuery);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar acessórios");
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      setIsPending(true);
      fetchData().finally(() => setIsPending(false));
    });

    return unsubscribe;
  }, [navigation]);

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

      {lastCheck && (
        <Card
          collapsible={true}
          initialCollapseState={false}
          collapsibleLabel="Última conferência"
          body={
            <PrinterCheckCardBody printerCheck={lastCheck} checkAccessories={checkAccessories} />
          }
        />
      )}

      <View style={styles.buttons}>
        <CustomButton
          title="Realizar conferência"
          iconName="checkbox-outline"
          onPress={() => navigation.navigate("CheckPrinter", { serialNumber })}
        />
        <CustomButton
          title="Histórico de conferências"
          iconName="list-outline"
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
