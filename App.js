import { NavigationContainer } from "@react-navigation/native";
import React from "react";

// components
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import PrinterStackScreen from "./src/screens/PrinterStack";
import Scan from "./src/screens/Scan";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="PrinterStack"
            component={PrinterStackScreen}
            options={{ title: "Home", headerShown: false }}
          />
          <Tab.Screen name="Scan" component={Scan} options={{ title: "Escaneie um QR Code" }} />
        </Tab.Navigator>
      </NavigationContainer>
      <Toast bottomOffset={60} />
    </GestureHandlerRootView>
  );
};

export default App;
