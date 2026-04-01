import { Link } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";

const actions = [
  { title: "Complaints", href: "/student/complaints" as const },
  { title: "Notices", href: "/student/notices" as const },
  { title: "Gate Pass", href: "/student/gate-pass" as const },
  { title: "Mess Feedback", href: "/student/mess-feedback" as const },
  { title: "Room Details", href: "/student/room" as const },
  { title: "Profile", href: "/student/profile" as const }
];

export default function StudentDashboardScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Student Dashboard</Text>
      <View style={styles.grid}>
        {actions.map((item) => (
          <Link href={item.href} asChild key={item.title}>
            <Pressable>
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
  heading: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "700"
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