import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PrinterCheck } from "../types/firebaseModels";

const PrinterCheckCard = ({
  printerCheck,
  title = null,
}: {
  printerCheck: PrinterCheck;
  title: string | null;
}) => {
  const dateString = printerCheck.date.toDate().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const [expand, setExpand] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      <View style={styles.header}>
        <Text style={styles.date}>{dateString}</Text>
        <TouchableOpacity
          containerStyle={styles.collapseButton}
          onPress={() => setExpand((prev) => !prev)}>
          <Text style={styles.collapseText}>{expand ? "Recolher" : "Expandir"}</Text>
        </TouchableOpacity>
      </View>

      {expand && <>{printerCheck.note && <Text>Observação: {printerCheck.note}</Text>}</>}
    </View>
  );
};

export default PrinterCheckCard;

const styles = StyleSheet.create({
  container: {
    minWidth: "100%",
    backgroundColor: "white",
    padding: 20,
    rowGap: 10,
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontWeight: "bold",
  },
  collapseButton: {
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "lightgray",
  },
  collapseText: {
    fontWeight: "bold",
  },
});
