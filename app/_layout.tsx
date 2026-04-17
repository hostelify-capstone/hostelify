import { router, Slot, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Colors } from "@/constants/colors";
import { Roles } from "@/constants/roles";

function RootNavigator() {
  const { user, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "auth";
    const inAdminGroup = segments[0] === "admin";
    const inStudentGroup = segments[0] === "student";

    if (!user) {
      // Unauthenticated: protect admin and student routes
      if (inAdminGroup || inStudentGroup) {
        router.replace("/auth/login");
      }
      // Home page / auth pages: leave as-is
    } else {
      // Authenticated user
      if (inAuthGroup) {
        // Already signed in — redirect away from login/register to correct dashboard
        router.replace(user.role === Roles.ADMIN ? "/admin/dashboard" : "/student/dashboard");
      } else if (user.role === Roles.ADMIN && inStudentGroup) {
        // Admin trying to access student routes
        router.replace("/admin/dashboard");
      } else if (user.role !== Roles.ADMIN && inAdminGroup) {
        // Student trying to access admin routes
        router.replace("/student/dashboard");
      }
      // Home page (index) or correct dashboard: leave as-is
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}
