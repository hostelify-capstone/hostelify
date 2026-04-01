import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

interface BadgeProps {
  label: string;
  tone?: "primary" | "secondary" | "success" | "warning" | "danger";
}

export const Badge = ({ label, tone = "primary" }: BadgeProps) => {
  return (
    <View style={[styles.badge, { backgroundColor: Colors[tone] }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700"
  }
});