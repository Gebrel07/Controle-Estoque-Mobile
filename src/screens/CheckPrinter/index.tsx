import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { auth } from "../../firebase/config";

// types
import { CheckedAccessory } from "../../types/accessoryTypes";
import { Client } from "../../types/clientTypes";
import { Printer } from "../../types/printerTypes";

// hooks
import { useCheckAccessories } from "../../hooks/useCheckAccessories";
import useClient from "../../hooks/useClient";
import { usePrinter } from "../../hooks/usePrinter";
import { usePrinterChecks } from "../../hooks/usePrinterChecks";

// components
import Toast from "react-native-toast-message";
import Card from "../../components/Card";
import CustomButton from "../../components/CustomButton";
import LoadingScreen from "../../components/LoadingScreen";
import PrinterCard from "../../components/PrinterCard";
import GlobalStyles from "../../components/styles";
import CheckItemButton from "./CheckItemButton";
import Checklist from "./Checklist";

const CheckPrinter = ({
  route,
  navigation,
}: {
  route: RouteProp<{ params: Record<string, any> }>;
  navigation: NavigationProp<any>;
}) => {
  const { serialNumber } = route.params;

  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [printer, setPrinter] = useState<Printer | null>(null);
  const [accessories, setAccessories] = useState<CheckedAccessory[] | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  const [serialNumberOk, setSerialNumberOk] = useState<boolean>(false);
  const [clientOk, setclientOk] = useState<boolean>(false);
  const [note, setNote] = useState<string | null>(null);

  const { queryPrinterBySN } = usePrinter();
  const { addPrinterCheck, completePrinterCheck } = usePrinterChecks();
  const { addCheckAccessory, getAccessoriesForCheck } = useCheckAccessories();
  const { queryClientById } = useClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const printer = await queryPrinterBySN(serialNumber);
        setPrinter(printer);

        if (printer) {
          const accessories = await getAccessoriesForCheck(printer.id);
          setAccessories(accessories);

          const client = await queryClientById(printer.clientId);
          setClient(client);
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar impressora");
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, []);

  const handlePress = (accessoryId: string, hasAccessory: boolean) => {
    if (!accessories) {
      return null;
    }

    setAccessories(
      accessories.map((accessory) => {
        if (accessory.id === accessoryId) {
          return { ...accessory, hasAccessory: hasAccessory };
        } else {
          return accessory;
        }
      })
    );
  };

  const handleTextChange = (text: string) => {
    const newText = text.trim();
    setNote(newText.length ? newText : null);
  };

  const handleSubmit = async () => {
    setIsPending(true);

    try {
      if (!printer) {
        throw new Error("printer is currently null");
      }

      if (!auth.currentUser) {
        throw new Error("auth.currentUser is currently null");
      }

      if (!client) {
        throw new Error("client is currently null");
      }

      const newPrinterCheckId = await addPrinterCheck(
        auth.currentUser.uid,
        printer.id,
        serialNumber,
        serialNumberOk,
        clientOk,
        client.address,
        note
      );

      if (accessories) {
        for (const accessory of accessories) {
          await addCheckAccessory(accessory.id, accessory.hasAccessory, newPrinterCheckId);
        }
      }

      await completePrinterCheck(newPrinterCheckId);

      Toast.show({
        type: "success",
        text1: "Conferência realizada com sucesso!",
        position: "bottom",
        visibilityTime: 5000,
      });
    } catch (err) {
      console.error(err);

      Toast.show({
        type: "error",
        text1: "Erro ao adicionar conferência",
        position: "bottom",
        visibilityTime: 5000,
      });
    } finally {
      navigation.goBack();
    }
  };

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

  if (!client) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar dados da impressora</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PrinterCard printer={printer} />

      <Card>
        <>
          <Text style={GlobalStyles.subtitle}>Confira o Número de série</Text>
          <Text>Clique para indicar se o número de série da impressora está correto ou não</Text>
          <CheckItemButton
            onPress={(checked) => {
              setSerialNumberOk(checked);
            }}>
            <Text>{printer.serialNumber}</Text>
          </CheckItemButton>
        </>
      </Card>

      <Card>
        <>
          <Text style={GlobalStyles.subtitle}>Confira o endereço do cliente</Text>
          <Text>Clique para indicar se o endereço está correto ou não</Text>
          <CheckItemButton
            onPress={(checked) => {
              setclientOk(checked);
            }}>
            <>
              <Text style={{ fontWeight: "bold" }}>{client.name}</Text>
              <Text>
                {client.address.street}, {client.address.number}
              </Text>
              <Text>
                {client.address.city}/{client.address.state}
              </Text>
              <Text>CEP: {client.address.zipCode}</Text>
            </>
          </CheckItemButton>
        </>
      </Card>

      <Checklist accessories={accessories} onAccessoryPress={handlePress} />

      <View style={styles.obsContainer}>
        <Text style={styles.title}>Observação</Text>
        <TextInput
          style={styles.obs}
          multiline
          placeholder="Insira uma observação (opcional)"
          onChangeText={handleTextChange}
        />
      </View>

      <CustomButton title="Enviar" iconName="send-sharp" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default CheckPrinter;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    rowGap: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  obsContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  obs: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    textAlign: "left",
  },
});
