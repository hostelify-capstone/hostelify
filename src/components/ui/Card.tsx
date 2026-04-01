import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { Colors } from "@/constants/colors";

export const Card = ({ style, ...props }: ViewProps) => {
  return <View {...props} style={[styles.card, style]} />;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1
  }
});