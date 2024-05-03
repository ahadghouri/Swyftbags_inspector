import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    console.log("Logging in", { email, password });
    axios
      .post(Constants.expoConfig.extra.IP_ADDRESS + "/adminLogin", {
        email,
        password,
      })
      .then((res) => {
        if (res.data) {
          console.log("navigating to dashboard");
          AsyncStorage.setItem("token", res.data.data);
          AsyncStorage.setItem("adminCity", res.data.adminCity);
          // console.log("admin city is ", res.data.adminCity);
          // console.log("token: ", res.data.data);
          if (email === "admin@gmail.com") {
            setEmail("");
            setPassword("");
            navigation.navigate("Dashboard");
          } else {
            navigation.navigate("InspectorDashboard");
          }
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.loginPage}>
      <View style={styles.loginContainer}>
        <Text style={styles.header}>Login</Text>
        <View style={styles.formGroup}>
          <Text>Email:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Enter Email"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.formGroup}>
          <Text>Password:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Enter Password"
            secureTextEntry
          />
        </View>
        <Button title="Login" onPress={handleLogin} color="#4caf50" />
      </View>
    </View>
  );
}

export default Login;

// styles.js
const styles = StyleSheet.create({
  loginPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#301934",
  },
  loginContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 8,
    padding: 20,
    width: 300,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 8,
    marginTop: 5,
  },
});
