import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LoginForm } from "@/components/forms/LoginForm";
import { Colors } from "@/constants/colors";
import { Roles } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"student" | "admin">("student");
  const [roleError, setRoleError] = useState<string | null>(null);

  const handleSubmit = async (email: string, password: string) => {
    setRoleError(null);
    const signedInUser = await signIn(email, password);

    // Verify Firestore role matches what the user selected
    if (signedInUser.role !== selectedRole) {
      // Sign them out so they're not stuck in the wrong session
      const { signOutUser } = await import("@/services/firebase/auth");
      await signOutUser();
      setRoleError(
        `This account is registered as "${signedInUser.role}". Please select the correct role above.`
      );
      return;
    }

    if (signedInUser.role === Roles.ADMIN) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/student/dashboard");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign in to Hostelify</Text>

      {/* Role Selector */}
      <View style={styles.roleRow}>
        <Pressable
          style={[styles.roleBtn, selectedRole === "student" && styles.roleBtnActive]}
          onPress={() => { setSelectedRole("student"); setRoleError(null); }}
        >
          <Text style={[styles.roleBtnText, selectedRole === "student" && styles.roleBtnTextActive]}>
            🎓 Student
          </Text>
        </Pressable>
        <Pressable
          style={[styles.roleBtn, selectedRole === "admin" && styles.roleBtnActive]}
          onPress={() => { setSelectedRole("admin"); setRoleError(null); }}
        >
          <Text style={[styles.roleBtnText, selectedRole === "admin" && styles.roleBtnTextActive]}>
            🛡️ Admin
          </Text>
        </Pressable>
      </View>

      {roleError ? <Text style={styles.roleError}>{roleError}</Text> : null}

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
    fontWeight: "700",
    marginBottom: 4
  },
  roleRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    backgroundColor: Colors.surface
  },
  roleBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight
  },
  roleBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.subtext
  },
  roleBtnTextActive: {
    color: Colors.primary
  },
  roleError: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: "500"
  },
  link: {
    color: Colors.primary,
    fontWeight: "600"
  }
});