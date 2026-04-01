import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import type { Notice } from "@/types";
import { formatDateTime } from "@/utils/formatters";

export const NoticeList = ({ notices }: { notices: Notice[] }) => {
  return (
    <FlatList
      data={notices}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.contentText}>{item.content}</Text>
          <Text style={styles.date}>{formatDateTime(item.postedAt)}</Text>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 10,
    paddingBottom: 20
  },
  card: {
    gap: 8
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700"
  },
  contentText: {
    color: Colors.text,
    fontSize: 14
  },
  date: {
    color: Colors.subtext,
    fontSize: 12
  }
});