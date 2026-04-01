import { Link, router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LoginForm } from "@/components/forms/LoginForm";
import { Colors } from "@/constants/colors";
import { Roles } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const { signIn } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    const signedInUser = await signIn(email, password);
    const role = signedInUser.role ?? (email.includes("admin") ? Roles.ADMIN : Roles.STUDENT);
    if (role === Roles.ADMIN) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/student/dashboard");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign in to Hostelify</Text>
      <LoginForm onSubmit={handleSubmit} />
      <Link href="/auth/register" style={styles.link}>
        New student? Create an account
      </Link>
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
  },
  link: {
    color: Colors.primary,
    fontWeight: "600"
  }
});