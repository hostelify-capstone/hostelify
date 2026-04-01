import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Colors } from "@/constants/colors";

interface ComplaintFormProps {
  onSubmit: (title: string, description: string, category: string) => void;
}

export const ComplaintForm = ({ onSubmit }: ComplaintFormProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Maintenance");
  const [description, setDescription] = useState("");

  return (
    <View style={styles.container}>
      <Input label="Title" value={title} onChangeText={setTitle} />
      <Input label="Category" value={category} onChangeText={setCategory} />
      <View style={styles.textAreaWrap}>
        <TextInput
          style={styles.textArea}
          placeholder="Describe the issue..."
          placeholderTextColor={Colors.subtext}
          multiline
          numberOfLines={5}
          value={description}
          onChangeText={setDescription}
        />
      </View>
      <Button
        title="Submit Complaint"
        onPress={() => {
          onSubmit(title.trim(), description.trim(), category.trim());
          setTitle("");
          setDescription("");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12
  },
  textAreaWrap: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.card
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
    padding: 12,
    color: Colors.text
  }
});