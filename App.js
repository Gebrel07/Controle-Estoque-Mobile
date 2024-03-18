import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Home from "./src/screens/Home";
import ViewPrinter from "./src/screens/Printer/ViewPrinter";
import Scan from "./src/screens/Scan";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Scan" component={Scan} options={{ title: "Escaneie um QR Code" }} />
        <Stack.Screen
          name="PrinterInfos"
          component={ViewPrinter}
          options={{ title: "Informações da impressora" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
