import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

interface AdminTopBarProps {
  title: string;
}

export const AdminTopBar = ({ title }: AdminTopBarProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.right}>
        {/* Notification bell */}
        <Pressable style={styles.iconBtn}>
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.notifDot} />
        </Pressable>
        {/* User avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Admin User</Text>
          <Text style={styles.userRole}>Super Admin</Text>
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
  bellIcon: {
    fontSize: 20,
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
