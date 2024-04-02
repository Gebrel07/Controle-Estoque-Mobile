import { RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// hooks
import { useCheckAccessories } from "../hooks/useCheckAccessories";
import { usePrinterChecks } from "../hooks/usePrinterChecks";

// types
import { CheckedAccessory } from "../types/accessoryTypes";
import { PrinterCheck } from "../types/printerTypes";

// components
import LoadingScreen from "../components/LoadingScreen";
import PrinterCheckCard from "../components/PrinterCheckCard";

const ViewPrinterCheck = ({ route }: { route: RouteProp<{ params: Record<string, any> }> }) => {
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [check, setCheck] = useState<PrinterCheck | null>(null);
  const [accessories, setAccessories] = useState<CheckedAccessory[] | null>(null);

  const { queryCheckById } = usePrinterChecks();
  const { queryCheckAccessoriesAndData } = useCheckAccessories();

  const { checkId } = route.params;

  useEffect(() => {
    queryCheckById(checkId)
      .then((printerCheck) => {
        setCheck(printerCheck);
        if (printerCheck) {
          queryCheckAccessoriesAndData(checkId)
            .then((checkedAccessories) => {
              setAccessories(checkedAccessories);
            })
            .catch((err) => {
              console.error(err);
              setError("Erro ao buscar acessórios da conferência");
            })
            .finally(() => setIsPending(false));
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao buscar conferência");
      });
  }, []);

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

  if (!check) {
    return (
      <View style={styles.container}>
        <Text>Conferência não encontrada. ID: {checkId}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PrinterCheckCard printerCheck={check} accessories={accessories} />
    </View>
  );
};

export default ViewPrinterCheck;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    rowGap: 15,
  },
});
