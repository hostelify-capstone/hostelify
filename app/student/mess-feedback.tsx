import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";

export default function MessFeedbackScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Mess Feedback</Text>
      <Card style={styles.card}>
        <Text style={styles.text}>Daily mess feedback form:</Text>
        <Text style={styles.text}>• Food Quality</Text>
        <Text style={styles.text}>• Cleanliness</Text>
        <Text style={styles.text}>• Timeliness</Text>
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