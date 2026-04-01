import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NoticeList } from "@/components/lists/NoticeList";
import { Colors } from "@/constants/colors";
import { useNotices } from "@/hooks/useNotices";

export default function AdminNoticesScreen() {
  const { notices } = useNotices();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Notices</Text>
      <NoticeList notices={notices} />
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