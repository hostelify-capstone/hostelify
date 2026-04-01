import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/colors";

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ImagePickerModal = ({ visible, onClose }: ImagePickerModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.panel}>
          <Text style={styles.title}>Upload Proof Image</Text>
          <Text style={styles.text}>Integrate expo-image-picker here for camera/gallery upload.</Text>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  panel: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 10
  },
  title: {
    color: Colors.text,
    fontWeight: "700",
    fontSize: 16
  },
  text: {
    color: Colors.subtext
  }
});