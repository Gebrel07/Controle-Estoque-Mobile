import { NavigationProp, RouteProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// hooks
import { useCheckAccessories } from "../../hooks/useCheckAccessories";
import { usePrinterChecks } from "../../hooks/usePrinterChecks";

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

  const [error, setError] = useState<string | null>(null);

  const [lastCheck, setLastCheck] = useState<PrinterCheck | null>(null);
  const [checkAccessories, setCheckAccessories] = useState<CheckedAccessory[] | null>(null);

  const { queryLastPrinterCheck } = usePrinterChecks();
  const { queryCheckAccessoriesAndData } = useCheckAccessories();

  useEffect(() => {
    if (printer) {
      queryLastPrinterCheck(printer.id)
        .then((printerCheck) => {
          setLastCheck(printerCheck);

          if (printerCheck) {
            queryCheckAccessoriesAndData(printerCheck.id)
              .then((accessories) => {
                setCheckAccessories(accessories);
              })
              .catch((err) => {
                console.error(err);
              });
          }
        })
        .catch((err) => console.error(err));
    }
  }, [printer]);

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
        <>
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
        </>
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
