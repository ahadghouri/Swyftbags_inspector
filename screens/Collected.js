import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const Collected = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const[travellerEmail, setTravellerEmail]=useState("");
  const[senderEmail, setSenderEmail]=useState("");
  const [currentTripId, setCurrentTripId] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const adminCity = await AsyncStorage.getItem("adminCity");
      const token = await AsyncStorage.getItem("token");

      // Fetch trips with status "reached inspector 2" and start field equal to adminCity
      const response = await axios.get(
        Constants.expoConfig.extra.IP_ADDRESS + "/inspector/tripsdest",
        {
          params: {
            status: "reached inspector 2",
            destination: adminCity,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTrips(response.data);
      setLoading(false);
      console.log("Fetched trips:", response.data);

      if (response.data.length > 0) {
        setSenderEmail(response.data[0].bidderEmail);
        setTravellerEmail(response.data[0].email);
        setCurrentTripId(response.data[0]._id);
      }
      

    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  
  const handleCollected = async(tripId, recvName) => {
    try {
      const token = await AsyncStorage.getItem("token");

      // First API call: Update trip status to "completed"
      await axios.put(
        `${Constants.expoConfig.extra.IP_ADDRESS}/inspector/trips/${tripId}`,
        { status: "completed" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const bidResponse = await axios.get(
        `${Constants.expoConfig.extra.IP_ADDRESS}/bids/accepted`,
        {
          params: { tripId: tripId, recvName: recvName },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bidAmount = bidResponse.data.bid;

      await axios.post(
        `${Constants.expoConfig.extra.IP_ADDRESS}/wallet/deposit`,
        { email: travellerEmail, amount: bidAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.post(
        `${Constants.expoConfig.extra.IP_ADDRESS}/friends/remove`,
        { senderEmail: senderEmail, travellerEmail: travellerEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Send email to sender
    await axios.post(
      `${Constants.expoConfig.extra.IP_ADDRESS}/sendEmailNotification`,
      {
        email: senderEmail,
        subject: 'Trip Completion Notification',
        message: `Your trip with ID ${tripId} has been completed successfully.`
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Send email to traveler
    await axios.post(
      `${Constants.expoConfig.extra.IP_ADDRESS}/sendEmailNotification`,
      {
        email: travellerEmail,
        subject: 'Trip Completion Notification',
        message: `Your trip with ID ${tripId} has been completed successfully, wallet balance is updated.`
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

      fetchData();
    } catch (error) {
      console.error("Error updating trip status or depositing amount:", error);
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
            <Text>Traveller: {trip.email}</Text>
            <Text>Sender: {trip.bidderEmail}</Text>
            <Text>Receiver: {trip.recvName}</Text>
            <Text>Receiver CNIC: {trip.recvCnic}</Text>
            <Text>Receiver Phone no: {trip.recvNumber}</Text>
            <Button title="Collected" onPress={() => handleCollected(trip._id, trip.recvName)} />
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

export default Collected;
