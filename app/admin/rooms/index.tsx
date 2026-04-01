import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";

export default function AdminRoomsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Rooms</Text>
      <Card>
        <Text style={styles.text}>Room allocation, vacancy, and maintenance statuses are managed here.</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
    gap: 12
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text
  },
  text: {
    color: Colors.text
  }
});