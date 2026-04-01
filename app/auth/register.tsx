import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterScreen() {
  const { register } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Student Registration</Text>
      <RegisterForm
        onSubmit={async (name, email, password) => {
          await register(name, email, password);
          router.replace("/student/dashboard");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 14,
    backgroundColor: Colors.background
  },
  heading: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "700"
  }
});