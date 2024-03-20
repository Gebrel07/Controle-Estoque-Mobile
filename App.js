import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

// components
import Toast from "react-native-toast-message";
import CheckPrinter from "./src/screens/CheckPrinter";
import Home from "./src/screens/Home";
import Scan from "./src/screens/Scan";
import ViewPrinter from "./src/screens/ViewPrinter";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Scan" component={Scan} options={{ title: "Escaneie um QR Code" }} />
        <Stack.Screen
          name="ViewPrinter"
          component={ViewPrinter}
          options={{ title: "Informações da impressora" }}
        />
        <Stack.Screen
          name="CheckPrinter"
          component={CheckPrinter}
          options={{ title: "Conferir impressora" }}
        />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default App;
