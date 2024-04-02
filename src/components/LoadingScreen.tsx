import React from "react";
import { ActivityIndicator, View } from "react-native";

const LoadingScreen = () => {
  return (
    <View style={{ justifyContent: "center", flex: 1 }}>
      <ActivityIndicator color="gray" size="large"/>
    </View>
  );
};

export default LoadingScreen;
