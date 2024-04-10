import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GlobalStyles from "./styles";

// hooks
import { useQueryUtils } from "../hooks/useQueryUtils";

// types
import { PrinterCheckData } from "../types/resultTypes";

// components
import CheckedItem from "./CheckedItem";

const PrinterCheckCardBody = ({ checkData }: { checkData: PrinterCheckData }) => {
  const { timestampToPtBrDateString } = useQueryUtils();

  const check = checkData.printerCheck;
  const address = check.address;
  const accessories = checkData.accessories;
  const user = checkData.user;

  return (
    <>
      <Text style={{ fontWeight: "bold" }}>{timestampToPtBrDateString(check.date)}</Text>

      <View>
        <Text style={GlobalStyles.subtitle}>Número de Série</Text>
        <CheckedItem itemOk={check.serialNumberOk}>
          <Text>{check.serialNumber}</Text>
        </CheckedItem>
      </View>

      <View>
        <Text style={GlobalStyles.subtitle}>Endereço</Text>
        <CheckedItem itemOk={check.addressOk}>
          <>
            <Text>
              {address.street}, {address.number}
            </Text>
            <Text>
              {address.city}/{address.state}
            </Text>
            <Text>CEP: {address.zipCode}</Text>
          </>
        </CheckedItem>
      </View>

      {accessories && (
        <View>
          <Text style={GlobalStyles.subtitle}>Acessórios</Text>
          <View style={{ rowGap: 5 }}>
            {accessories.map((accessory) => (
              <CheckedItem itemOk={accessory.hasAccessory} key={accessory.id}>
                <Text>{accessory.type}</Text>
              </CheckedItem>
            ))}
          </View>
        </View>
      )}

      {check.note && (
        <View>
          <Text style={{ ...GlobalStyles.subtitle, marginBottom: 10 }}>Observação</Text>
          <Text style={styles.noteText}>{check.note}</Text>
        </View>
      )}

      <View>
        <Text style={{ ...GlobalStyles.subtitle, marginBottom: 10 }}>Conferido por</Text>
        <Text>{user.displayName}</Text>
        <Text style={{ color: "gray", fontSize: 12 }}>{user.userId}</Text>
      </View>
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
