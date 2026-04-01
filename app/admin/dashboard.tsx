import { Link } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";

const stats = [
  { label: "Total Students", value: 320, tone: "primary" as const },
  { label: "Open Complaints", value: 18, tone: "warning" as const },
  { label: "Active Notices", value: 6, tone: "secondary" as const },
  { label: "Available Rooms", value: 27, tone: "success" as const }
];

const management = [
  { title: "Manage Complaints", href: "/admin/complaints" as const },
  { title: "Manage Students", href: "/admin/students" as const },
  { title: "Manage Notices", href: "/admin/notices" as const },
  { title: "Manage Rooms", href: "/admin/rooms" as const }
];

export default function AdminDashboardScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Admin Dashboard</Text>

      <View style={styles.statsWrap}>
        {stats.map((stat) => (
          <Card key={stat.label} style={styles.statCard}>
            <Badge label={stat.label} tone={stat.tone} />
            <Text style={styles.statValue}>{stat.value}</Text>
          </Card>
        ))}
      </View>

      <Text style={styles.subheading}>Management</Text>
      <View style={styles.managementWrap}>
        {management.map((item) => (
          <Link href={item.href} asChild key={item.title}>
            <Pressable>
              <Card style={styles.mgmtCard}>
                <Text style={styles.mgmtText}>{item.title}</Text>
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
    gap: 12,
    backgroundColor: Colors.background
  },
  heading: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "700"
  },
  subheading: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700"
  },
  statsWrap: {
    gap: 10
  },
  statCard: {
    gap: 10
  },
  statValue: {
    color: Colors.text,
    fontSize: 30,
    fontWeight: "800"
  },
  managementWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  mgmtCard: {
    width: 165,
    minHeight: 88,
    alignItems: "center",
    justifyContent: "center"
  },
  mgmtText: {
    color: Colors.text,
    fontWeight: "600",
    textAlign: "center"
  }
});