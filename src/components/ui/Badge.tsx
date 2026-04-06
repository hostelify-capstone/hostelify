import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

interface BadgeProps {
  label: string;
  tone?: "primary" | "secondary" | "success" | "warning" | "danger";
}

const toneColors = {
  primary: { bg: Colors.primaryLight, text: Colors.primaryDark },
  secondary: { bg: Colors.secondaryLight, text: Colors.secondary },
  success: { bg: Colors.successLight, text: Colors.success },
  warning: { bg: Colors.warningLight, text: Colors.warning },
  danger: { bg: Colors.dangerLight, text: Colors.danger },
};

export const Badge = ({ label, tone = "primary" }: BadgeProps) => {
  const colors = toneColors[tone];
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});