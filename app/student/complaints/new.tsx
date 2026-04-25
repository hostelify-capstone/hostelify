import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentShell } from "@/components/layout/StudentShell";
import { ImagePickerModal } from "@/components/modals/ImagePickerModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useComplaints } from "@/hooks/useComplaints";
import { useAuth } from "@/hooks/useAuth";

const CATEGORIES = ["Water", "Electricity", "WiFi", "Maintenance", "Mess", "General"];

export default function NewComplaintScreen() {
  const { user } = useAuth();
  const { addComplaint } = useComplaints(user?.id);
  const [category, setCategory] = useState("Maintenance");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [proofAdded, setProofAdded] = useState(false);

  return (
    <StudentShell title="Raise Complaint" subtitle="Share issue details for faster resolution" showBottomNav={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Complaint Details</Text>

          <Text style={styles.inputLabel}>Category</Text>
          <View style={styles.categoryWrap}>
            {CATEGORIES.map((item) => (
              <Pressable
                key={item}
                style={[styles.categoryBtn, category === item && styles.categoryBtnActive]}
                onPress={() => setCategory(item)}
              >
                <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.inputLabel}>Issue Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Water leakage in washroom"
            placeholderTextColor={Colors.subtext}
            style={styles.input}
          />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the problem with relevant details"
            placeholderTextColor={Colors.subtext}
            style={styles.textArea}
            multiline
            numberOfLines={5}
          />

          <Pressable style={styles.uploadBtn} onPress={() => setImageModalVisible(true)}>
            <Ionicons name={proofAdded ? "checkmark-circle" : "camera-outline"} size={18} color={Colors.primaryDark} />
            <Text style={styles.uploadBtnText}>{proofAdded ? "Image Added" : "Upload Image"}</Text>
          </Pressable>

          <Button
            title="Submit Complaint"
            onPress={() => {
              if (!title.trim() || !description.trim()) {
                Alert.alert("Missing fields", "Please add title and description.");
                return;
              }

              addComplaint({
                title: title.trim(),
                description: description.trim(),
                category,
                createdBy: user?.id ?? "unknown",
                studentName: user?.name,
                roomNumber: user?.roomNumber,
              });

              Alert.alert("Complaint submitted", "Your complaint has been raised successfully.", [
                {
                  text: "OK",
                  onPress: () => router.replace("/student/complaints"),
                },
              ]);
            }}
          />
        </Card>
      </ScrollView>

      <ImagePickerModal
        visible={imageModalVisible}
        onClose={() => {
          setImageModalVisible(false);
          setProofAdded(true);
        }}
      />
    </StudentShell>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: 14,
    paddingBottom: 24,
  },
  formCard: {
    gap: 10,
    padding: 16,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  inputLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  categoryBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    color: Colors.subtext,
    fontSize: 12,
    fontWeight: "700",
  },
  categoryTextActive: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.text,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 110,
    color: Colors.text,
    textAlignVertical: "top",
  },
  uploadBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingVertical: 11,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 2,
  },
  uploadBtnText: {
    color: Colors.primaryDark,
    fontSize: 13,
    fontWeight: "700",
  },
});
