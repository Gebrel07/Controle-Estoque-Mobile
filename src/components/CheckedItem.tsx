import Ionicons from "@expo/vector-icons/Ionicons";
import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";

const CheckedItem = ({ itemOk, children }: { itemOk: boolean; children: ReactElement }) => {
  const lowOpacityGreen = "rgba(0, 255, 0, 0.05)";
  const lowOpacityRed = "rgba(255, 0, 0, 0.05)";

  return (
    <View
      style={{
        ...styles.item,
        borderColor: itemOk ? "green" : "red",
        backgroundColor: itemOk ? lowOpacityGreen : lowOpacityRed,
      }}>
      <View style={{ flex: 1, justifyContent: "center", marginEnd: 15 }}>{children}</View>
      <View style={{ justifyContent: "center" }}>
        {itemOk ? (
          <>
            <Ionicons name="checkmark-circle-outline" size={20} color="green" />
          </>
        ) : (
          <>
            <Ionicons name="close-circle-outline" size={20} color="red" />
          </>
        )}
      </View>
    </View>
  );
};

export default CheckedItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
  },
});
