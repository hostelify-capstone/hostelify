import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";

interface StudentTopBarProps {
  title: string;
}

export const StudentTopBar = ({ title }: StudentTopBarProps) => {
  const { user } = useAuth();

  const initials = (user?.name ?? "Student User")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.right}>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={22} color={Colors.text} />
          <View style={styles.notifDot} />
        </Pressable>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name ?? "Student User"}</Text>
          <Text style={styles.userRole}>Hostel Resident</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.card,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.2,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBtn: {
    position: "relative",
    padding: 4,
  },
  notifDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: Colors.card,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.primaryDark,
    fontSize: 16,
    fontWeight: "800",
  },
  userInfo: {
    gap: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  userRole: {
    fontSize: 11,
    color: Colors.subtext,
    fontWeight: "500",
  },
});
