import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import LoadingScreen from "../components/LoadingScreen";
import { usePrinterChecks } from "../hooks/usePrinterChecks";
import { useQueryUtils } from "../hooks/useQueryUtils";
import { PrinterCheck } from "../types/printerTypes";

const CheckHistory = ({
  route,
  navigation,
}: {
  route: RouteProp<{ params: Record<string, any> }>;
  navigation: NavigationProp<any>;
}) => {
  const { printerId } = route.params;

  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checks, setChecks] = useState<PrinterCheck[] | null>(null);

  const { queryChecksByPrinterId } = usePrinterChecks();
  const { timestampToPtBrDateString } = useQueryUtils();

  useEffect(() => {
    queryChecksByPrinterId(printerId, true)
      .then((printerChecks) => {
        setChecks(printerChecks);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar histórico");
      })
      .finally(() => setIsPending(false));
  }, []);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!checks) {
    return (
      <View>
        <Text>Sem histórico de conferência</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Clique em uma das conferências para ver os detalhes</Text>
      {checks.map((printerCheck) => (
        <TouchableOpacity
          style={styles.historyButton}
          key={printerCheck.id}
          onPress={() => navigation.navigate("ViewPrinterCheck", { checkId: printerCheck.id })}>
          <Text style={styles.date}>{timestampToPtBrDateString(printerCheck.date)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CheckHistory;

const styles = StyleSheet.create({
  container: {
    rowGap: 15,
    padding: 20,
  },
  historyButton: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  date: {
    fontWeight: "bold",
  },
});
