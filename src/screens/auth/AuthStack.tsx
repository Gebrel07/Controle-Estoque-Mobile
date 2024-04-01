import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import Signup from "./Signup";

const Stack = createStackNavigator();

const AuthStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} options={{ title: "Criar conta" }} />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ title: "Redefinir senha" }}
      />
    </Stack.Navigator>
  );
};

export default AuthStackScreen;
