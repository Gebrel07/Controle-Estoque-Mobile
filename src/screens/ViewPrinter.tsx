import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// hooks
import { usePrinter } from "../hooks/usePrinter";

// types
import { PrinterData } from "../types/resultTypes";

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
  route: RouteProp<any>;
  navigation: NavigationProp<any>;
}) => {
  const { serialNumber }: any = route.params;

  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [printerData, setPrinterData] = useState<PrinterData | null>(null);

  const { getPrinterDataBySerialNumber } = usePrinter();

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      try {
        const data = await getPrinterDataBySerialNumber(serialNumber);
        setPrinterData(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar dados da impressora");
      } finally {
        setIsPending(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
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

  if (!printerData) {
    return (
      <View style={styles.container}>
        <Text>Impressora não encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PrinterCard printer={printerData.printer} />

      {printerData.lastCheck && (
        <Card collapsible={true} initialCollapseState={false} collapsibleLabel="Última conferência">
          <PrinterCheckCardBody checkData={printerData.lastCheck} />
        </Card>
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
          onPress={() => navigation.navigate("CheckHistory", { printerId: printerData.printer.id })}
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
