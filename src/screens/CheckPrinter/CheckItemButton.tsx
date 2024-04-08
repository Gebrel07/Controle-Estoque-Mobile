import Ionicons from "@expo/vector-icons/Ionicons";
import React, { ReactElement, useState } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const CheckItemButton = ({
  onPress,
  children,
}: {
  onPress: (checked: boolean) => void;
  children: ReactElement;
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  const lowOpacityGreen = "rgba(0, 255, 0, 0.05)";
  const lowOpacityRed = "rgba(255, 0, 0, 0.05)";

  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        borderColor: checked ? "green" : "red",
        backgroundColor: checked ? lowOpacityGreen : lowOpacityRed,
      }}
      onPress={() => {
        const newVal = !checked;
        setChecked(newVal);
        onPress(newVal);
      }}>
      <View style={{ flex: 1, justifyContent: "center", marginEnd: 15 }}>{children}</View>
      <View style={{ justifyContent: "center" }}>
        {checked ? (
          <>
            <Ionicons name="checkmark-circle-outline" size={20} color="green" />
          </>
        ) : (
          <>
            <Ionicons name="close-circle-outline" size={20} color="red" />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CheckItemButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
  },
});
