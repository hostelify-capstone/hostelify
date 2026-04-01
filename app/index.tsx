import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/colors";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hostelify</Text>
      <Text style={styles.subtitle}>Smart hostel management for students and admins.</Text>

      <Link href="/auth/login" asChild>
        <View>
          <Button title="Get Started" onPress={() => undefined} />
        </View>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    padding: 20,
    gap: 12
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: Colors.primary
  },
  subtitle: {
    color: Colors.subtext,
    textAlign: "center",
    marginBottom: 12
  }
});