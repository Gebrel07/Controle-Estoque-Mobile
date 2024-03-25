import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

// types
import { CheckedAccessory } from "../../types/accessoryTypes";
import { PrinterCheck } from "../../types/printerTypes";

const LastCheckCard = ({
  printerCheck,
  accessories,
}: {
  printerCheck: PrinterCheck;
  accessories: CheckedAccessory[] | null;
}) => {
  const dateString = printerCheck.date.toDate().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const [expand, setExpand] = useState<boolean>(false);
  const enableExpand = printerCheck.note || accessories ? true : false;

  return (
    <View style={styles.container}>
      {<Text style={styles.title}>Última conferência</Text>}

      <View style={styles.header}>
        <Text style={styles.date}>{dateString}</Text>
        {enableExpand && (
          <TouchableOpacity
            containerStyle={styles.collapseButton}
            onPress={() => setExpand((prev) => !prev)}>
            <Text style={styles.collapseText}>{expand ? "Recolher" : "Expandir"}</Text>
          </TouchableOpacity>
        )}
      </View>

      {expand && (
        <>
          {printerCheck.note && <Text>Observação: {printerCheck.note}</Text>}

          {accessories && (
            <View>
              <Text style={styles.subtitle}>Acessórios</Text>
              {accessories.map((accessory) => (
                <View style={styles.row} key={accessory.id}>
                  <View style={styles.accessoryName}>
                    <Text>{accessory.type}</Text>
                  </View>
                  <View>
                    <Text>{accessory.hasAccessory ? "OK" : "Falta"}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default LastCheckCard;

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
