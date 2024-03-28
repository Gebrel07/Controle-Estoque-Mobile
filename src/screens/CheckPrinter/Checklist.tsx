import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CheckedAccessory } from "../../types/accessoryTypes";

const Checklist = ({
  accessories,
  onAccessoryPress,
}: {
  accessories: CheckedAccessory[] | null;
  onAccessoryPress: (accessoryId: string, hasAccessory: boolean) => any;
}) => {
  if (!accessories || !accessories.length) {
    return (
      <View style={styles.container}>
        <Text>Nenhum acessório cadastrado nesta impressora</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confira os acessórios abaixo</Text>
      <Text>Clique em cada acessório para marca-lo como OK ou Faltante</Text>
      {accessories.map((accessory) => (
        <TouchableOpacity
          key={accessory.id}
          style={styles.accessory}
          onPress={() => onAccessoryPress(accessory.id, !accessory.hasAccessory)}>
          <View>
            <Text style={styles.accessoryTitle}>{accessory.type}</Text>
            <Text style={{ color: "gray" }}>{accessory.serialNumber}</Text>
          </View>
          <View style={{ justifyContent: "center" }}>
            <Text style={{ fontWeight: "bold" }}>{accessory.hasAccessory ? "OK" : "Falta"}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Checklist;

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
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
