import Ionicons from "@expo/vector-icons/Ionicons";
import React, { ReactElement, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import GlobalStyles from "./styles";

const Card = ({
  body,
  collapsible = false,
  initialCollapseState = false,
  collapsibleLabel,
}: {
  body: ReactElement;
  collapsible?: boolean;
  initialCollapseState?: boolean;
  collapsibleLabel?: string;
}) => {
  const [expand, setExpand] = useState<boolean>(() => (collapsible ? initialCollapseState : true));

  return (
    <View style={GlobalStyles.card}>
      {collapsible && (
        <TouchableOpacity style={styles.header} onPress={() => setExpand((prev) => !prev)}>
          <Text style={{ fontWeight: "bold" }}>{collapsibleLabel ? collapsibleLabel : ""}</Text>
          <Ionicons name={expand ? "caret-up-sharp" : "caret-down-sharp"} size={20} color="gray" />
        </TouchableOpacity>
      )}

      {expand && <>{body}</>}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  header: {
    minWidth: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  collapseButton: {
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "lightgray",
  },
});
