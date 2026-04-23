import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { useComplaints } from "@/hooks/useComplaints";



export default function ComplaintsScreen() {
  const { user } = useAuth();
  const { complaints } = useComplaints(user?.id);
  const [filter, setFilter] = useState<"all" | "open" | "in-progress" | "resolved">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return complaints;
    return complaints.filter((item) => item.status === filter);
  }, [filter, complaints]);

  return (
    <StudentShell title="Complaint System" subtitle="Raise and track complaint progress">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.filterRow}>
          <FilterButton label="All" active={filter === "all"} onPress={() => setFilter("all")} />
          <FilterButton label="Pending" active={filter === "open"} onPress={() => setFilter("open")} />
          <FilterButton
            label="In Progress"
            active={filter === "in-progress"}
            onPress={() => setFilter("in-progress")}
          />
          <FilterButton
            label="Resolved"
            active={filter === "resolved"}
            onPress={() => setFilter("resolved")}
          />
        </View>

        <Link href="/student/complaints/new" asChild>
          <Pressable style={styles.newBtn}>
            <Ionicons name="add-circle-outline" size={18} color="#fff" />
            <Text style={styles.newBtnText}>Raise Complaint</Text>
          </Pressable>
        </Link>

        <View style={styles.list}>
          {filtered.map((item) => (
            <Card key={item.id} style={styles.itemCard}>
              <View style={styles.itemTop}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={[styles.statusPill, { backgroundColor: statusBg(item.status) }]}>
                  <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                    {statusLabel(item.status)}
                  </Text>
                </View>
              </View>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.trackerRow}>
                <TrackStep label="Pending" active />
                <TrackStep label="In Progress" active={item.status !== "open"} />
                <TrackStep label="Resolved" active={item.status === "resolved"} />
              </View>
            </Card>
          ))}
        </View>

        {filtered.length === 0 ? (
          <Card>
            <Text style={styles.empty}>No complaints in this status.</Text>
          </Card>
        ) : null}
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
  <Pressable style={[styles.filterBtn, active && styles.filterBtnActive]} onPress={onPress}>
    <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
  </Pressable>
);

const TrackStep = ({ label, active }: { label: string; active: boolean }) => (
  <View style={styles.trackStep}>
    <View style={[styles.trackDot, active && styles.trackDotActive]} />
    <Text style={[styles.trackLabel, active && styles.trackLabelActive]}>{label}</Text>
  </View>
);

function statusLabel(status: "open" | "in-progress" | "resolved") {
  if (status === "open") return "Pending";
  if (status === "in-progress") return "In Progress";
  return "Resolved";
}

function statusColor(status: "open" | "in-progress" | "resolved") {
  if (status === "open") return Colors.warning;
  if (status === "in-progress") return Colors.info;
  return Colors.success;
}

function statusBg(status: "open" | "in-progress" | "resolved") {
  if (status === "open") return Colors.warningLight;
  if (status === "in-progress") return Colors.infoLight;
  return Colors.successLight;
}

const styles = StyleSheet.create({
  scroll: {
    gap: 12,
    paddingBottom: 24,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: Colors.card,
  },
  filterBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: Colors.subtext,
    fontSize: 12,
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#fff",
  },
  newBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  newBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  list: {
    gap: 10,
  },
  itemCard: {
    gap: 9,
    padding: 14,
  },
  itemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },
  itemTitle: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  itemCategory: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  itemDescription: {
    color: Colors.text,
    fontSize: 13,
  },
  trackerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  trackStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trackDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  trackDotActive: {
    backgroundColor: Colors.primary,
  },
  trackLabel: {
    color: Colors.subtext,
    fontSize: 11,
    fontWeight: "600",
  },
  trackLabelActive: {
    color: Colors.text,
  },
  empty: {
    color: Colors.subtext,
    textAlign: "center",
    fontSize: 13,
    paddingVertical: 8,
  },
});
