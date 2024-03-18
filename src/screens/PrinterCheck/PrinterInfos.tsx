import { RouteProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { usePrinterInfos } from "../../hooks/usePrinterInfos";
import { Printer } from "../../types/firebaseModels";
import PrinterAccessories from "./PrinterAccessories";

const PrinterInfos = ({ route }: { route: RouteProp<{ params: { serialNumber: string } }> }) => {
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [printer, setPrinter] = useState<Printer | null>(null);

  const { queryPrinterBySN } = usePrinterInfos();

  const { serialNumber }: { serialNumber: string } = route.params;

  useEffect(() => {
    queryPrinterBySN(serialNumber)
      .then((res) => {
        setPrinter(res);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao buscar impressora");
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

  if (printer === null) {
    return (
      <View style={styles.container}>
        <Text>Impressora não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image
          style={styles.img}
          source={require("../../assets/printer.png")}
          alt="Imagem impressora"
        />
      </View>
      <Text style={styles.model}>{printer.model}</Text>
      <Text style={styles.serialNumber}>{printer.serialNumber}</Text>
      {printer && (
        <View style={styles.accessories}>
          <PrinterAccessories printerId={printer.id} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  imgContainer: {
    height: 100,
    width: 100,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 50,
    marginBottom: 10,
    padding: 10,
    alignItems: "center",
    overflow: "hidden",
  },
  img: {
    objectFit: "cover",
    maxHeight: "100%",
    maxWidth: "100%",
  },
  model: {
    fontWeight: "bold",
    fontSize: 20,
  },
  serialNumber: {
    color: "grey",
  },
  accessories: {
    flex: 1,
    marginTop: 20,
  },
});

export default PrinterInfos;
