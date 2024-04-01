import { onAuthStateChanged } from "@firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { auth } from "./src/firebase/config";

// components
import Toast from "react-native-toast-message";
import MainTabScreen from "./src/screens/MainTabScreen";
import AuthStackScreen from "./src/screens/auth/AuthStack";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
      },
      (err) => {
        console.error(err);
      }
    );
    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>{user ? <MainTabScreen /> : <AuthStackScreen />}</NavigationContainer>
      <Toast bottomOffset={60} />
    </GestureHandlerRootView>
  );
};

export default App;
