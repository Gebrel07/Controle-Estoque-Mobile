import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const CustomButton = ({
  title,
  onPress,
  backgroundColor,
  textColor,
  iconName,
  iconColor,
}: {
  title: string;
  onPress: () => any;
  backgroundColor?: string;
  textColor?: string;
  iconName?: string;
  iconColor?: string;
}) => {
  const _backgroundColor = backgroundColor ? backgroundColor : "gray";
  const _textColor = textColor ? textColor : "white";
  const _iconColor = iconColor ? iconColor : "white";

  return (
    <TouchableOpacity style={{ ...styles.btn, backgroundColor: _backgroundColor }} onPress={onPress}>
      {/* @ts-ignore */}
      {iconName && <Ionicons name={iconName} size={20} color={_iconColor} />}
      <Text style={{ color: _textColor }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    columnGap: 10,
    borderRadius: 5,
    padding: 10,
    width: "100%",
    justifyContent: "center",
  },
});
