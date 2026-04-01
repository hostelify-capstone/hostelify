import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { Colors } from "@/constants/colors";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: "#fff",
          contentStyle: { backgroundColor: Colors.background }
        }}
      />
    </AuthProvider>
  );
}