import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ComplaintList } from "@/components/lists/ComplaintList";
import { Colors } from "@/constants/colors";
import { useComplaints } from "@/hooks/useComplaints";

export default function AdminComplaintsScreen() {
  const { complaints } = useComplaints();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Complaints</Text>
      <ComplaintList complaints={complaints} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
    gap: 12
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text
  }
});