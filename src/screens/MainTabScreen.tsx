import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

// components
import Ionicons from "@expo/vector-icons/Ionicons";
import PrinterStackScreen from "./PrinterStack";
import Profile from "./Profile";
import Scan from "./Scan";

const Tab = createBottomTabNavigator();

const MainTabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        unmountOnBlur: true,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      }}>
      <Tab.Screen
        name="PrinterStack"
        component={PrinterStackScreen}
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons name={focused ? "home-sharp" : "home-outline"} size={20} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Scan"
        component={Scan}
        options={{
          title: "Escanear",
          headerTitle: "Escaneie um QR Code",
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons
                name={focused ? "qr-code-sharp" : "qr-code-outline"}
                size={20}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Perfil",
          headerTitle: "Meu perfil",
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons name={focused ? "person-sharp" : "person-outline"} size={20} color={color} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabScreen;
