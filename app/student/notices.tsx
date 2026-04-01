import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NoticeList } from "@/components/lists/NoticeList";
import { Colors } from "@/constants/colors";
import { useNotices } from "@/hooks/useNotices";

export default function NoticesScreen() {
  const { notices } = useNotices();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notices</Text>
      <NoticeList notices={notices} />
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