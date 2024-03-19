import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

// types
import { Accessory } from "../../types/firebaseModels";

const ChecklistItem = ({
  accessory,
  onChecked,
}: {
  accessory: Accessory;
  onChecked: (accessoryId: string, checked: boolean) => any;
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    onChecked(accessory.id, checked);
  }, [checked]);

  return (
    <TouchableOpacity style={styles.accessory} onPress={() => setChecked((prev) => !prev)}>
      <View>
        <Text style={styles.accessoryTitle}>{accessory.type}</Text>
        <Text style={{ color: "gray" }}>{accessory.serialNumber}</Text>
      </View>
      <View style={{ justifyContent: "center" }}>
        <Text style={{ fontWeight: "bold" }}>{checked ? "OK" : "Falta"}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChecklistItem;

const styles = StyleSheet.create({
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
