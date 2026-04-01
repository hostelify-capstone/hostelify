import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/colors";

interface ConfirmModalProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({ visible, message, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.content}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Button title="Cancel" onPress={onCancel} variant="secondary" />
            <Button title="Confirm" onPress={onConfirm} variant="danger" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20
  },
  content: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    gap: 16
  },
  message: {
    color: Colors.text,
    fontSize: 15
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  }
});