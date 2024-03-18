import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Home from "./src/screens/Home";
import PrinterInfos from "./src/screens/PrinterCheck/PrinterInfos";
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
          component={PrinterInfos}
          options={{ title: "Revisar Produto" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
