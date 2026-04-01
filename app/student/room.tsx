import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";

export default function RoomScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Room Details</Text>
      <Card style={styles.card}>
        <Text style={styles.text}>Room: A-204</Text>
        <Text style={styles.text}>Block: A</Text>
        <Text style={styles.text}>Occupancy: 2 / 3</Text>
        <Text style={styles.text}>Roommate: Rahul Sharma</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    gap: 12
  },
  heading: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "700"
  },
  card: {
    gap: 8
  },
  text: {
    color: Colors.text,
    fontSize: 14
  }
});