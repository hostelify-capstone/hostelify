import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>My Profile</Text>
      <Card style={styles.card}>
        <ProfileRow label="Name" value={user?.name} />
        <ProfileRow label="Email" value={user?.email} />
        <ProfileRow label="Role" value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : undefined} />
        {user?.roomNumber ? <ProfileRow label="Room" value={user.roomNumber} /> : null}
        {user?.phone ? <ProfileRow label="Phone" value={user.phone} /> : null}
        {user?.enrollmentNo ? <ProfileRow label="Enrollment No." value={user.enrollmentNo} /> : null}
        {user?.course ? <ProfileRow label="Course" value={user.course} /> : null}
        {user?.year ? <ProfileRow label="Year" value={String(user.year)} /> : null}
      </Card>
      <Button title="Sign Out" onPress={signOut} variant="danger" />
    </ScrollView>
  );
}

const ProfileRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value ?? "—"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    backgroundColor: Colors.background
  },
  heading: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "700"
  },
  card: {
    gap: 12
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  label: {
    color: Colors.subtext,
    fontSize: 14,
    fontWeight: "500"
  },
  value: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600"
  }
});