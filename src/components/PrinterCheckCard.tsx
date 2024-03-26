import React from "react";
import { StyleSheet, Text, View } from "react-native";

// types
import { CheckedAccessory } from "../types/accessoryTypes";
import { PrinterCheck } from "../types/printerTypes";

// hooks
import { useQueryUtils } from "../hooks/useQueryUtils";

const PrinterCheckCard = ({
  printerCheck,
  accessories,
  title,
}: {
  printerCheck: PrinterCheck;
  accessories: CheckedAccessory[] | null;
  title?: string;
}) => {
  const { timestampToPtBrDateString } = useQueryUtils();

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      <Text style={styles.date}>{timestampToPtBrDateString(printerCheck.date)}</Text>

      <Text>Observação: {printerCheck.note}</Text>

      <View>
        <Text style={styles.subtitle}>Acessórios</Text>
        {accessories && accessories.length ? (
          accessories.map((accessory) => (
            <View style={styles.row} key={accessory.id}>
              <View style={styles.accessoryName}>
                <Text>{accessory.type}</Text>
              </View>
              <View>
                <Text>{accessory.hasAccessory ? "OK" : "Falta"}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text>Sem acessórios cadastrados no momento da conferência</Text>
        )}
      </View>
    </View>
  );
};

export default PrinterCheckCard;

const styles = StyleSheet.create({
  container: {
    minWidth: "100%",
    backgroundColor: "white",
    padding: 20,
    rowGap: 20,
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  date: {
    fontWeight: "bold",
  },
  subtitle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "lightgray",
    borderBottomWidth: 1,
    padding: 10,
  },
  accessoryName: {
    maxWidth: "70%",
  },
});
