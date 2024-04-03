import { RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// hooks
import { useCheckAccessories } from "../hooks/useCheckAccessories";
import { usePrinterChecks } from "../hooks/usePrinterChecks";
import useUser from "../hooks/useUser";

// types
import { CheckedAccessory } from "../types/accessoryTypes";
import { PrinterCheck } from "../types/printerTypes";
import { User } from "../types/userTypes";

// components
import LoadingScreen from "../components/LoadingScreen";
import PrinterCheckCard from "../components/PrinterCheckCard";

const ViewPrinterCheck = ({ route }: { route: RouteProp<{ params: Record<string, any> }> }) => {
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [check, setCheck] = useState<PrinterCheck | null>(null);
  const [accessories, setAccessories] = useState<CheckedAccessory[] | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const { queryCheckById } = usePrinterChecks();
  const { queryCheckAccessoriesWithdData } = useCheckAccessories();
  const { getUserById } = useUser();

  const { checkId } = route.params;

  useEffect(() => {
    const fetchPrinterCheckData = async (checkId: string) => {
      try {
        const printerCheck = await queryCheckById(checkId);

        if (!printerCheck) {
          return;
        }

        setCheck(printerCheck);

        const checkedAccessories = await queryCheckAccessoriesWithdData(checkId);
        setAccessories(checkedAccessories);

        const user = await getUserById(printerCheck.userId);
        setUser(user);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar dados da conferência");
      } finally {
        setIsPending(false);
      }
    };

    fetchPrinterCheckData(checkId);
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

  if (!check || !user) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar dados da conferência. ID: {checkId}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PrinterCheckCard printerCheck={check} accessories={accessories} user={user} />
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
