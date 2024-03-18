import React from "react";
import { View } from "react-native";

const Divider = ({ color = "gray", height = 1 }: { color?: string; height?: number }) => {
  return <View style={{ backgroundColor: color, minHeight: height, minWidth: "100%" }} />;
};

export default Divider;
