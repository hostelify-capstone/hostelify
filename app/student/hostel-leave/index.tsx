import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useHostelLeaves } from "@/hooks/useHostelLeaves";
import type { LeaveStatus } from "@/types";

const CURRENT_STUDENT_ID = "stu-1";

export default function HostelLeaveScreen() {
  const { leaves, stats } = useHostelLeaves();
  const [filter, setFilter] = useState<"all" | LeaveStatus>("all");

  const myLeaves = useMemo(
    () => leaves.filter((item) => item.studentId === CURRENT_STUDENT_ID),
    [leaves]
  );

  const filtered = useMemo(() => {
    if (filter === "all") return myLeaves;
    return myLeaves.filter((item) => item.status === filter);
  }, [filter, myLeaves]);

  const myStats = useMemo(() => {
    const mine = leaves.filter((l) => l.studentId === CURRENT_STUDENT_ID);
    return {
      total: mine.length,
      pending: mine.filter((l) => l.status === "pending").length,
      approved: mine.filter((l) => l.status === "approved").length,
      rejected: mine.filter((l) => l.status === "rejected").length,
    };
  }, [leaves]);

  return (
    <StudentShell title="Hostel Leave" subtitle="Apply and track your leave requests">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatMini label="Total" value={myStats.total} color={Colors.primary} icon="documents-outline" />
          <StatMini label="Pending" value={myStats.pending} color={Colors.warning} icon="time-outline" />
          <StatMini label="Approved" value={myStats.approved} color={Colors.success} icon="checkmark-circle-outline" />
          <StatMini label="Rejected" value={myStats.rejected} color={Colors.danger} icon="close-circle-outline" />
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          <FilterButton label="All" active={filter === "all"} onPress={() => setFilter("all")} />
          <FilterButton label="Pending" active={filter === "pending"} onPress={() => setFilter("pending")} />
          <FilterButton label="Approved" active={filter === "approved"} onPress={() => setFilter("approved")} />
          <FilterButton label="Rejected" active={filter === "rejected"} onPress={() => setFilter("rejected")} />
        </View>

        {/* Apply Button */}
        <Link href="/student/hostel-leave/new" asChild>
          <Pressable style={styles.newBtn}>
            <Ionicons name="add-circle-outline" size={18} color="#fff" />
            <Text style={styles.newBtnText}>Apply for Leave</Text>
          </Pressable>
        </Link>

        {/* Leave Cards */}
        <View style={styles.list}>
          {filtered.map((item) => (
            <Card key={item.id} style={styles.itemCard}>
              <View style={styles.itemTop}>
                <View style={styles.leaveTypeBadge}>
                  <Ionicons
                    name={
                      item.leaveType === "day"
                        ? "sunny-outline"
                        : item.leaveType === "night"
                        ? "moon-outline"
                        : "airplane-outline"
                    }
                    size={14}
                    color={Colors.primary}
                  />
                  <Text style={styles.leaveTypeText}>{leaveTypeLabel(item.leaveType)}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: statusBg(item.status) }]}>
                  <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                    {statusLabel(item.status)}
                  </Text>
                </View>
              </View>

              <Text style={styles.itemReason} numberOfLines={2}>
                {item.reason}
              </Text>

              <View style={styles.detailsGrid}>
                <DetailRow icon="location-outline" label="Visit Place" value={item.visitPlace} />
                <DetailRow icon="calendar-outline" label="From" value={formatDate(item.startDate)} />
                <DetailRow icon="calendar-outline" label="To" value={formatDate(item.endDate)} />
                <DetailRow icon="call-outline" label="Mobile" value={item.mobileNo} />
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={12} color={Colors.muted} />
                <Text style={styles.metaText}>Applied: {formatDate(item.appliedAt)}</Text>
              </View>

              {/* Status Tracker */}
              <View style={styles.trackerRow}>
                <TrackStep label="Applied" active />
                <View style={[styles.trackerLine, item.status !== "pending" && styles.trackerLineActive]} />
                <TrackStep
                  label={item.status === "rejected" ? "Rejected" : "Approved"}
                  active={item.status !== "pending"}
                  isRejected={item.status === "rejected"}
                />
              </View>
            </Card>
          ))}
        </View>

        {filtered.length === 0 && (
          <Card style={styles.emptyCard}>
            <Ionicons name="document-text-outline" size={40} color={Colors.muted} />
            <Text style={styles.emptyTitle}>No leave requests found</Text>
            <Text style={styles.emptySubtext}>
              {filter === "all"
                ? "You haven't applied for any leave yet."
                : `No ${filter} leave requests.`}
            </Text>
          </Card>
        )}
      </ScrollView>
    </StudentShell>
  );
}

/* ── Helper Components ── */

const StatMini = ({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>  
    <View style={styles.statIconWrap}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

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

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) => (
  <View style={styles.detailRow}>
    <Ionicons name={icon} size={14} color={Colors.muted} />
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const TrackStep = ({
  label,
  active,
  isRejected,
}: {
  label: string;
  active: boolean;
  isRejected?: boolean;
}) => (
  <View style={styles.trackStep}>
    <View
      style={[
        styles.trackDot,
        active && !isRejected && styles.trackDotActive,
        active && isRejected && styles.trackDotRejected,
      ]}
    />
    <Text
      style={[
        styles.trackLabel,
        active && !isRejected && styles.trackLabelActive,
        active && isRejected && styles.trackLabelRejected,
      ]}
    >
      {label}
    </Text>
  </View>
);

/* ── Helpers ── */

function leaveTypeLabel(type: string) {
  if (type === "day") return "Day Leave";
  if (type === "night") return "Night Leave";
  return "Vacation Leave";
}

function statusLabel(status: LeaveStatus) {
  if (status === "pending") return "Pending";
  if (status === "approved") return "Approved";
  return "Rejected";
}

function statusColor(status: LeaveStatus) {
  if (status === "pending") return Colors.warning;
  if (status === "approved") return Colors.success;
  return Colors.danger;
}

function statusBg(status: LeaveStatus) {
  if (status === "pending") return Colors.warningLight;
  if (status === "approved") return Colors.successLight;
  return Colors.dangerLight;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── Styles ── */

const styles = StyleSheet.create({
  scroll: {
    gap: 14,
    paddingBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    gap: 4,
  },
  statIconWrap: {
    marginBottom: 2,
  },
  statValue: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  statLabel: {
    color: Colors.subtext,
    fontSize: 11,
    fontWeight: "600",
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
    paddingHorizontal: 14,
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
    gap: 10,
    padding: 16,
  },
  itemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leaveTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primaryLight + "30",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  leaveTypeText: {
    color: Colors.primary,
    fontSize: 12,
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
  itemReason: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  detailsGrid: {
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailLabel: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  detailValue: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "700",
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: Colors.muted,
    fontSize: 11,
    fontWeight: "500",
  },
  trackerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    gap: 0,
  },
  trackerLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  trackerLineActive: {
    backgroundColor: Colors.primary,
  },
  trackStep: {
    alignItems: "center",
    gap: 4,
  },
  trackDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
  },
  trackDotActive: {
    backgroundColor: Colors.success,
  },
  trackDotRejected: {
    backgroundColor: Colors.danger,
  },
  trackLabel: {
    color: Colors.subtext,
    fontSize: 10,
    fontWeight: "600",
  },
  trackLabelActive: {
    color: Colors.success,
  },
  trackLabelRejected: {
    color: Colors.danger,
  },
  emptyCard: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 32,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  emptySubtext: {
    color: Colors.subtext,
    fontSize: 13,
  },
});
