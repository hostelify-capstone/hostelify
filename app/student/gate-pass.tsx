import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";

export default function GatePassScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Gate Pass</Text>
      <Card style={styles.card}>
        <Text style={styles.text}>Submit gate pass requests with destination, date, and reason.</Text>
        <Text style={styles.text}>Status tracking: Pending • Approved • Rejected</Text>
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