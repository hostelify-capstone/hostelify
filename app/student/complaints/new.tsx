import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { ComplaintForm } from "@/components/forms/ComplaintForm";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { useComplaints } from "@/hooks/useComplaints";

export default function NewComplaintScreen() {
  const { user } = useAuth();
  const { addComplaint } = useComplaints(user?.id);
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Raise a Complaint</Text>
      <ComplaintForm
        onSubmit={async (title, description, category) => {
          if (!title || !description) {
            Alert.alert("Missing Fields", "Please enter title and description.");
            return;
          }
          try {
            setLoading(true);
            await addComplaint({
              title,
              description,
              category,
              createdBy: user?.id ?? "unknown",
              studentName: user?.name,
              roomNumber: user?.roomNumber,
            });
            Alert.alert("Submitted", "Your complaint has been submitted.", [
              { text: "OK", onPress: () => router.back() }
            ]);
          } catch (e) {
            Alert.alert("Error", "Failed to submit. Please try again.");
          } finally {
            setLoading(false);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16, gap: 12 },
  heading:   { color: Colors.text, fontSize: 22, fontWeight: "700" }
});