import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";

// components
import { NavigationProp } from "@react-navigation/native";
import CheckHistory from "./CheckHistory";
import CheckPrinter from "./CheckPrinter";
import Home from "./Home";
import ViewPrinter from "./ViewPrinter";
import ViewPrinterCheck from "./ViewPrinterCheck";

const PrinterStack = createStackNavigator();

const PrinterStackScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      navigation.reset({ index: 1, routes: [{ name: "Home" }] });
    });
    return unsubscribe;
  }, []);

  return (
    <PrinterStack.Navigator>
      <PrinterStack.Screen name="Home" component={Home} options={{ title: "Home" }} />
      <PrinterStack.Screen
        name="ViewPrinter"
        component={ViewPrinter}
        options={{ title: "Informações da impressora" }}
      />
      <PrinterStack.Screen
        // @ts-ignore
        name="CheckPrinter"
        // @ts-ignore
        component={CheckPrinter}
        options={{ title: "Conferir impressora" }}
      />
      <PrinterStack.Screen
        // @ts-ignore
        name="CheckHistory"
        // @ts-ignore
        component={CheckHistory}
        options={{ title: "Histórico de conferências" }}
      />
      <PrinterStack.Screen
        // @ts-ignore
        name="ViewPrinterCheck"
        // @ts-ignore
        component={ViewPrinterCheck}
        options={{ title: "Visualizar conferência" }}
      />
    </PrinterStack.Navigator>
  );
};

export default PrinterStackScreen;
