import { Link, router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";

const actions = [
  { title: "🏠 Room Booking",  href: "/student/room-booking" as const },
  { title: "💳 Fee Payment",   href: "/student/fees" as const },
  { title: "📋 Complaints",    href: "/student/complaints" as const },
  { title: "📢 Notices",       href: "/student/notices" as const },
  { title: "🚪 Gate Pass",     href: "/student/gate-pass" as const },
  { title: "🍽️ Mess Feedback", href: "/student/mess-feedback" as const },
  { title: "🛏️ Room Details",  href: "/student/room" as const },
  { title: "👤 Profile",       href: "/student/profile" as const },
];

export default function StudentDashboardScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/auth/login");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Welcome, {user?.name?.split(" ")[0] ?? "Student"} 👋</Text>
          <Text style={styles.sub}>What would you like to do today?</Text>
        </View>
        <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {actions.map((item) => (
          <Link href={item.href} asChild key={item.title}>
            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <Card style={styles.card}>
                <Text style={styles.cardText}>{item.title}</Text>
              </Card>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
    backgroundColor: Colors.background
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heading: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "700"
  },
  sub: {
    color: Colors.subtext,
    fontSize: 14,
    marginTop: 2,
  },
  signOutBtn: {
    backgroundColor: Colors.dangerLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  signOutText: {
    color: Colors.danger,
    fontWeight: "700",
    fontSize: 13,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  card: {
    width: 160,
    minHeight: 90,
    alignItems: "center",
    justifyContent: "center"
  },
  cardText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: "600"
  }
});