import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "@/constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "success" | "danger";
  loading?: boolean;
}

export const Button = ({ title, onPress, variant = "primary", loading }: ButtonProps) => {
  const backgroundColor = Colors[variant];

  return (
    <Pressable style={[styles.button, { backgroundColor }]} onPress={onPress} disabled={loading}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center"
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});