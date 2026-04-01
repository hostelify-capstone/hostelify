import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { ComplaintForm } from "@/components/forms/ComplaintForm";
import { Colors } from "@/constants/colors";
import { useComplaints } from "@/hooks/useComplaints";

export default function NewComplaintScreen() {
  const { addComplaint } = useComplaints();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Raise a Complaint</Text>
      <ComplaintForm
        onSubmit={(title, description, category) => {
          if (!title || !description) {
            Alert.alert("Missing Fields", "Please enter title and description.");
            return;
          }
          addComplaint({ title, description, category, createdBy: "student-1" });
          Alert.alert("Submitted", "Complaint submitted with AI-priority classification.", [
            { text: "OK", onPress: () => router.back() }
          ]);
        }}
      />
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
  }
});