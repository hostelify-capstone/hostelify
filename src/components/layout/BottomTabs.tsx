import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

export const BottomTabs = () => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>Bottom tab placeholder for custom nav.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: "center"
  },
  text: {
    color: Colors.subtext,
    fontSize: 12
  }
});