import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// hooks
import { useCheckAccessories } from "../hooks/useCheckAccessories";
import { usePrinter } from "../hooks/usePrinter";
import { usePrinterChecks } from "../hooks/usePrinterChecks";
import useUser from "../hooks/useUser";

// types
import { CheckedAccessory } from "../types/accessoryTypes";
import { Printer, PrinterCheck } from "../types/printerTypes";
import { User } from "../types/userTypes";

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

  const [printer, setPrinter] = useState<Printer | null>(null);

  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [lastCheck, setLastCheck] = useState<PrinterCheck | null>(null);
  const [checkAccessories, setCheckAccessories] = useState<CheckedAccessory[] | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const { queryPrinterBySN } = usePrinter();
  const { queryLastPrinterCheck } = usePrinterChecks();
  const { queryCheckAccessoriesWithdData } = useCheckAccessories();
  const { getUserById } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      try {
        const printerQuery = await queryPrinterBySN(serialNumber);

        if (!printerQuery) {
          setError("Impressora não encontrada");
          return;
        }

        setPrinter(printerQuery);

        const lasCheckQuery = await queryLastPrinterCheck(printerQuery.id);

        if (lasCheckQuery) {
          setLastCheck(lasCheckQuery);
          const checkAccessoriesQuery = await queryCheckAccessoriesWithdData(lasCheckQuery.id);
          setCheckAccessories(checkAccessoriesQuery);
          const user = await getUserById(lasCheckQuery.userId);
          setUser(user);
        }
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

      {lastCheck && user && (
        <Card
          collapsible={true}
          initialCollapseState={false}
          collapsibleLabel="Última conferência"
          body={
            <PrinterCheckCardBody
              printerCheck={lastCheck}
              checkAccessories={checkAccessories}
              user={user}
            />
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
