import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { usePrinterInfos } from "../../hooks/usePrinterInfos";
import { AccessoryForCheck } from "../../types/firebaseModels";

const PrinterAccessories = ({ printerId }: { printerId: string }) => {
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accessories, setAccessories] = useState<AccessoryForCheck[] | null>(null);

  const { getPrinterAccessoryInfos } = usePrinterInfos();

  const separator = () => {
    return <View style={{ height: 20 }}></View>;
  };

  useEffect(() => {
    getPrinterAccessoryInfos(printerId)
      .then((res) => {
        setAccessories(res);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao buscar acessórios");
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

  if (accessories === null) {
    return (
      <View style={styles.container}>
        <Text>Nenhum acessório encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acessórios</Text>
      <FlatList
        ItemSeparatorComponent={separator}
        data={accessories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.accessory}>
            <View>
              <Text style={styles.accessoryTitle}>{item.type}</Text>
              <Text style={{ color: "gray" }}>{item.serialNumber}</Text>
            </View>
            <View style={{ justifyContent: "center" }}>
              <Text style={{ ...styles.hasAccessory, color: item.hasAccessory ? "green" : "red" }}>
                {item.hasAccessory ? "Ok" : "Falta"}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { minWidth: "100%" },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  accessory: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    padding: 20,
  },
  accessoryTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  hasAccessory: {
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default PrinterAccessories;
