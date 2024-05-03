import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

const Dashboard = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get(
        Constants.expoConfig.extra.IP_ADDRESS + "/admin/pending-users"
      );
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchPendingUsers();
  };

  const handleLogout = () => {
    // Implement logout logic here (clear user session, navigate to login page, etc.)
    navigation.navigate("Login"); // Navigate to the login page after logout
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await axios.post(
        Constants.expoConfig.extra.IP_ADDRESS + "/admin/update-status",
        { userId, status }
      );
      fetchPendingUsers(); // Refresh list after updating
    } catch (error) {
      console.error("Failed to update user status", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Button
          title="Refresh"
          onPress={handleRefresh}
          style={styles.refreshButton}
        />
        {users.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>No users to verify</Text>
          </View>
        ) : (
          users.map((user) => (
            <View key={user._id} style={styles.card}>
              <Image source={{ uri: user.profilePic }} style={styles.image} />
              <Image source={{ uri: user.frontCNIC }} style={styles.image} />
              <Image source={{ uri: user.backCNIC }} style={styles.image} />
              <Text>Name: {user.name}</Text>
              <Text>Email: {user.email}</Text>
              <Text>CNIC: {user.cnic}</Text>
              <Text>Address: {user.address}</Text>
              <Text>Phone Number: {user.phoneNumber}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  title="Approve"
                  onPress={() => updateUserStatus(user._id, "approved")}
                />
                <Button
                  title="Reject"
                  onPress={() => updateUserStatus(user._id, "rejected")}
                />
              </View>
            </View>
          ))
        )}
        <Button
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: StatusBar.currentHeight || 0, // Adjust for status bar height
    padding: 10,
  },
  card: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowColor: "#000",
    shadowOffset: { height: 0, width: 0 },
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshButton: {
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 10,
  },
});

export default Dashboard;
