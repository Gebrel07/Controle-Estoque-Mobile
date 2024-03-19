import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

// hooks
import { usePrinterInfos } from "../hooks/usePrinterInfos";

// types
import { Printer as PrinterInterface } from "../types/firebaseModels";

const PrinterCard = ({
  serialNumber,
  onQueryDone,
  onError,
}: {
  serialNumber: string;
  onQueryDone?: (printer: PrinterInterface | null) => any;
  onError?: () => any;
}) => {
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [printer, setPrinter] = useState<PrinterInterface | null>(null);

  const { queryPrinterBySN } = usePrinterInfos();

  useEffect(() => {
    queryPrinterBySN(serialNumber)
      .then((res) => {
        setPrinter(res);
        if (onQueryDone) {
          onQueryDone(res);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao buscar impressora");
        if (onError) {
          onError();
        }
      })
      .finally(() => {
        setIsPending(false);
      });
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
          source={require("../assets/printer.png")}
          alt="Imagem impressora"
        />
      </View>
      <Text style={styles.model}>{printer.model}</Text>
      <Text style={styles.serialNumber}>{printer.serialNumber}</Text>
    </View>
  );
};

export default PrinterCard;

const styles = StyleSheet.create({
  container: {
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
});
