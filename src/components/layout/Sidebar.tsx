import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

export const Sidebar = () => {
  return (
    <View style={styles.sidebar}>
      <Text style={styles.title}>Hostelify</Text>
      <Text style={styles.subtitle}>Sidebar placeholder for tablet/web layouts.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: Colors.card,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    padding: 16,
    gap: 6
  },
  title: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "800"
  },
  subtitle: {
    color: Colors.subtext,
    fontSize: 13
  }
});