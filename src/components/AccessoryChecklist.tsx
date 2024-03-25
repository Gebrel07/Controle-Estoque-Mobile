import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CheckedAccessory } from "../types/accessoryTypes";

const AccessoryChecklist = ({ checkedAccessories }: { checkedAccessories: CheckedAccessory[] }) => {
  return (
    <View>
      <Text style={styles.title}>Acessórios</Text>
      {checkedAccessories.map((accessory) => (
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
  );
};

export default AccessoryChecklist;

const styles = StyleSheet.create({
  title: {
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
