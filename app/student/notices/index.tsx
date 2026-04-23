import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useNotices } from "@/hooks/useNotices";
import { formatDateTime } from "@/utils/formatters";

export default function StudentNoticesScreen() {
  const { notices } = useNotices();
  const [filter, setFilter] = useState<"latest" | "important">("latest");

  const filteredNotices = useMemo(() => {
    const sorted = [...notices].sort((a, b) => (a.postedAt > b.postedAt ? -1 : 1));
    if (filter === "latest") return sorted;
    return sorted.filter((item) => isImportant(item.category ?? "General"));
  }, [filter, notices]);

  return (
    <StudentShell title="Notices" subtitle="Hostel announcements and updates">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.filterRow}>
          <FilterButton
            label="Latest"
            active={filter === "latest"}
            onPress={() => setFilter("latest")}
          />
          <FilterButton
            label="Important"
            active={filter === "important"}
            onPress={() => setFilter("important")}
          />
        </View>

        {filteredNotices.map((notice) => {
          const important = isImportant(notice.category ?? "General");
          return (
            <Card
              key={notice.id}
              style={[styles.noticeCard, important && styles.importantCard]}
            >
              <View style={styles.noticeTop}>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryText}>{notice.category ?? "General"}</Text>
                </View>
                {important ? (
                  <Text style={styles.importantTag}>Important</Text>
                ) : null}
              </View>
              <Text style={styles.noticeTitle}>{notice.title}</Text>
              <Text style={styles.noticeContent}>{notice.content}</Text>
              <Text style={styles.noticeDate}>{formatDateTime(notice.postedAt)}</Text>
            </Card>
          );
        })}
      </ScrollView>
    </StudentShell>
  );
}

const FilterButton = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable style={[styles.filterButton, active && styles.filterButtonActive]} onPress={onPress}>
    <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
  </Pressable>
);

function isImportant(category: string) {
  return category === "Fee" || category === "Maintenance";
}

const styles = StyleSheet.create({
  scroll: {
    gap: 12,
    paddingBottom: 24,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    color: Colors.subtext,
    fontSize: 13,
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#fff",
  },
  noticeCard: {
    gap: 8,
    padding: 14,
  },
  importantCard: {
    borderColor: Colors.warning,
    borderWidth: 1.4,
  },
  noticeTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  categoryPill: {
    borderRadius: 8,
    backgroundColor: Colors.surface,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  categoryText: {
    color: Colors.subtext,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  importantTag: {
    color: Colors.warning,
    fontSize: 12,
    fontWeight: "800",
  },
  noticeTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  noticeContent: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  noticeDate: {
    color: Colors.subtext,
    fontSize: 12,
  },
});
