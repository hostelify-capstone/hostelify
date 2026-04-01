import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { Colors } from "@/constants/colors";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={Colors.subtext} style={styles.input} {...props} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 6
  },
  label: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600"
  },
  input: {
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.text
  },
  error: {
    color: Colors.danger,
    fontSize: 12
  }
});