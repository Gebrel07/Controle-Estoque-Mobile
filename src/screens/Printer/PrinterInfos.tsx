import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Printer as PrinterInterface } from "../../types/firebaseModels";

const PrinterInfos = ({ printer }: { printer: PrinterInterface }) => {
  return (
    <>
      <View style={styles.imgContainer}>
        <Image
          style={styles.img}
          source={require("../../assets/printer.png")}
          alt="Imagem impressora"
        />
      </View>
      <Text style={styles.model}>{printer.model}</Text>
      <Text style={styles.serialNumber}>{printer.serialNumber}</Text>
    </>
  );
};

export default PrinterInfos;

const styles = StyleSheet.create({
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
