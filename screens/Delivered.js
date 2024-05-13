import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const Delivered = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const adminCity = await AsyncStorage.getItem("adminCity");
      const token = await AsyncStorage.getItem("token");

      // Fetch trips with status "accepted" and start field equal to adminCity
      const response = await axios.get(
        Constants.expoConfig.extra.IP_ADDRESS + "/inspector/trips",
        {
          params: {
            status: "accepted",
            start: adminCity,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTrips(response.data);
      setLoading(false);
      console.log("Fetched trips:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleReceived = async (tripId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      // Update trip status to "reached inspector 1" when received
      await axios.put(
        Constants.expoConfig.extra.IP_ADDRESS + `/inspector/trips/${tripId}`,
        { status: "reached inspector 1" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchData();
    } catch (error) {
      console.error("Error updating trip status:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : trips.length === 0 ? (
        <View style={styles.noTripsContainer}>
          <Text>No trips available</Text>
        </View>
      ) : (
        trips.map((trip) => (
          <View key={trip._id} style={styles.card}>
            <Text>Start: {trip.start}</Text>
            <Text>Destination: {trip.destination}</Text>
            <Text>Start Date: {trip.startdate}</Text>
            <Text>Start Time: {trip.starttime}</Text>
            <Text>End Date: {trip.enddate}</Text>
            <Text>End Time: {trip.endtime}</Text>
            <Text>Capacity: {trip.capacity}kg</Text>
            <Text>Transport Mode: {trip.tmode}</Text>
            <Text>Description: {trip.description}</Text>
            <Text>Sender: {trip.bidderEmail}</Text>
            

            <Button title="Received" onPress={() => handleReceived(trip._id)} />
          </View>
        ))
      )}
      
      <Button title="Refresh" onPress={fetchData} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
    width: "90%",
    alignSelf: "center",
    elevation: 3,
  },
  noTripsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Delivered;
