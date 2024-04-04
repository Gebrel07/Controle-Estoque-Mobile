import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GlobalStyles from "./styles";

// hooks
import { useQueryUtils } from "../hooks/useQueryUtils";

// types
import { CheckedAccessory } from "../types/accessoryTypes";
import { PrinterCheck } from "../types/printerTypes";

const PrinterCheckCardBody = ({
  printerCheck,
  checkAccessories,
}: {
  printerCheck: PrinterCheck;
  checkAccessories: CheckedAccessory[] | null;
}) => {
  const { timestampToPtBrDateString } = useQueryUtils();

  return (
    <>
      <Text style={{ fontWeight: "bold" }}>{timestampToPtBrDateString(printerCheck.date)}</Text>

      {checkAccessories && (
        <View>
          <Text style={GlobalStyles.subtitle}>Acessórios</Text>
          {checkAccessories.map((accessory) => (
            <View style={styles.row} key={accessory.id}>
              <View style={styles.accessoryName}>
                <Text>{accessory.type}</Text>
              </View>
              <View style={{ flexDirection: "row", columnGap: 5 }}>
                {accessory.hasAccessory ? (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={20} color="green" />
                    <Text>OK</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="close-circle-outline" size={20} color="red" />
                    <Text>Falta</Text>
                  </>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {printerCheck.note && (
        <View>
          <Text style={{ ...GlobalStyles.subtitle, marginBottom: 10 }}>Observação</Text>
          <Text style={styles.noteText}>{printerCheck.note}</Text>
        </View>
      )}
    </>
  );
};

export default PrinterCheckCardBody;

const styles = StyleSheet.create({
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
  noteText: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    padding: 10,
  },
});
