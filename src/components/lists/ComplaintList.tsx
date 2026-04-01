import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import type { Complaint } from "@/types";
import { formatDateTime } from "@/utils/formatters";

const priorityToneMap: Record<Complaint["priority"], "primary" | "secondary" | "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
  critical: "danger"
};

export const ComplaintList = ({ complaints }: { complaints: Complaint[] }) => {
  return (
    <FlatList
      data={complaints}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <Badge label={item.priority.toUpperCase()} tone={priorityToneMap[item.priority]} />
          </View>
          <Text style={styles.meta}>{item.category} • {item.status}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.date}>{formatDateTime(item.createdAt)}</Text>
        </Card>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No complaints available.</Text>}
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8
  },
  title: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700"
  },
  meta: {
    color: Colors.subtext,
    fontSize: 13
  },
  description: {
    color: Colors.text,
    fontSize: 14
  },
  date: {
    color: Colors.subtext,
    fontSize: 12
  },
  empty: {
    textAlign: "center",
    color: Colors.subtext,
    marginTop: 30
  }
});