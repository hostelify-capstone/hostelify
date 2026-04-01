import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <Card style={styles.card}>
        <Text style={styles.text}>Name: {user?.name ?? "Demo Student"}</Text>
        <Text style={styles.text}>Email: {user?.email ?? "student@hostel.com"}</Text>
        <Text style={styles.text}>Room: {user?.roomNumber ?? "A-204"}</Text>
      </Card>
      <Button title="Sign Out" onPress={signOut} variant="danger" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    gap: 12
  },
  heading: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "700"
  },
  card: {
    gap: 8
  },
  text: {
    color: Colors.text,
    fontSize: 14
  }
});