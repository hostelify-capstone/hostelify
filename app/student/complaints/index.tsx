import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ComplaintList } from "@/components/lists/ComplaintList";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/colors";
import { useComplaints } from "@/hooks/useComplaints";

export default function ComplaintsScreen() {
  const { complaints } = useComplaints();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Complaints</Text>
        <Link href="/student/complaints/new" asChild>
          <Pressable>
            <Button title="New" onPress={() => undefined} variant="secondary" />
          </Pressable>
        </Link>
      </View>
      <ComplaintList complaints={complaints} />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  heading: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "700"
  }
});