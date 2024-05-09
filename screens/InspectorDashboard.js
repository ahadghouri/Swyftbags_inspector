import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InspectorDashboard = () => {
  const navigation = useNavigation();

  const handleDeliveredPress = () => {
    navigation.navigate("Delivered");
  };

  const handlePickedUpPress = () => {
    navigation.navigate("PickedUp");
  };

  const handleTravelerDeliveredPress = () => {
    navigation.navigate("TravelerDelivered");
  };

  const handleCollectedPress = () => {
    navigation.navigate("Collected");
  };

  const handleLogout = async () => {
    // Implement logout logic here (clear user session, navigate to login page, etc.)
    await AsyncStorage.setItem("token", "");
    await AsyncStorage.setItem("adminCity", "");
    navigation.navigate("Login"); // Navigate to the login page after logout
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Parcels to be Delivered by Sender"
          onPress={handleDeliveredPress}
        />
        <Button 
          title="Parcels to be Picked Up" 
          onPress={handlePickedUpPress} 
        />
        <Button 
          title="Parcels to be Delivered by Traveler" 
          onPress={handleTravelerDeliveredPress} 
        />
        <Button
          title="Parcels to be Collected"
          onPress={handleCollectedPress}
        />
        <Button
          title="Logout"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default InspectorDashboard;
