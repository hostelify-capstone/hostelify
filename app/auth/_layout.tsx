import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        options={{ title: "Hostelify — Sign In" }}
      />
      <Stack.Screen
        name="register"
        options={{ title: "Hostelify — Create Account" }}
      />
    </Stack>
  );
}