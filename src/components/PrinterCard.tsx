import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

// types
import { Printer } from "../types/printerTypes";

const PrinterCard = ({ printer }: { printer: Printer }) => {
  const [error, setError] = useState<boolean>(false);

  const imgFallback = require("../assets/printer.png");

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image
          style={styles.img}
          source={!error && printer.imgUrl ? printer.imgUrl : imgFallback}
          alt="Imagem impressora"
          onError={() => setError(true)}
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
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "100%"
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
