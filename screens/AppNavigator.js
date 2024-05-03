import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./Login";
import Dashboard from "./Dashboard";
import InspectorDashboard from "./InspectorDashboard";
import Delivered from "./Delivered";
import PickedUp from "./PickedUp";
import TravelerDelivered from "./TravelerDelivered";
import Collected from "./Collected";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Login}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InspectorDashboard"
          component={InspectorDashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Delivered"
          component={Delivered}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PickedUp"
          component={PickedUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TravelerDelivered"
          component={TravelerDelivered}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Collected"
          component={Collected}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
