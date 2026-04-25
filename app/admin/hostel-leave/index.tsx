import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useHostelLeaves } from "@/hooks/useHostelLeaves";
import type { LeaveStatus } from "@/types";

export default function AdminHostelLeaveScreen() {
  const { leaves, updateLeaveStatus, stats } = useHostelLeaves();
  const [filter, setFilter] = useState<"all" | LeaveStatus>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return leaves;
    return leaves.filter((l) => l.status === filter);
  }, [filter, leaves]);

  const handleAction = (leaveId: string, action: "approved" | "rejected") => {
    Alert.alert(
      `${action === "approved" ? "Approve" : "Reject"} Leave`,
      `Are you sure you want to ${action === "approved" ? "approve" : "reject"} this leave request?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => updateLeaveStatus(leaveId, action),
        },
      ]
    );
  };

  return (
    <AdminShell title="Hostel Leave Management">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBox label="Total" value={stats.total} color={Colors.primary} />
          <StatBox label="Pending" value={stats.pending} color={Colors.warning} />
          <StatBox label="Approved" value={stats.approved} color={Colors.success} />
          <StatBox label="Rejected" value={stats.rejected} color={Colors.danger} />
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          <FilterBtn label="All" active={filter === "all"} onPress={() => setFilter("all")} />
          <FilterBtn label="Pending" active={filter === "pending"} onPress={() => setFilter("pending")} />
          <FilterBtn label="Approved" active={filter === "approved"} onPress={() => setFilter("approved")} />
          <FilterBtn label="Rejected" active={filter === "rejected"} onPress={() => setFilter("rejected")} />
        </View>

        {/* Leave Table */}
        <Card style={styles.tableCard}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.thText, { flex: 1.2 }]}>Student</Text>
            <Text style={[styles.thText, { flex: 0.8 }]}>Leave Type</Text>
            <Text style={[styles.thText, { flex: 1 }]}>Visit Place</Text>
            <Text style={[styles.thText, { flex: 1.5 }]}>Reason</Text>
            <Text style={[styles.thText, { flex: 1 }]}>Date</Text>
            <Text style={[styles.thText, { flex: 0.7 }]}>Status</Text>
            <Text style={[styles.thText, { flex: 1 }]}>Action</Text>
          </View>

          {/* Table Rows */}
          {filtered.map((leave, index) => (
            <View
              key={leave.id}
              style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}
            >
              <View style={{ flex: 1.2 }}>
                <Text style={styles.cellName}>{leave.studentName}</Text>
                <Text style={styles.cellSub}>Room {leave.roomNumber}</Text>
              </View>
              <Text style={[styles.cellText, { flex: 0.8 }]}>{leaveTypeLabel(leave.leaveType)}</Text>
              <Text style={[styles.cellText, { flex: 1 }]}>{leave.visitPlace}</Text>
              <Text style={[styles.cellText, { flex: 1.5 }]} numberOfLines={2}>
                {leave.reason}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cellSub}>{formatDate(leave.startDate)}</Text>
                <Text style={styles.cellSub}>to {formatDate(leave.endDate)}</Text>
              </View>
              <View style={{ flex: 0.7 }}>
                <View style={[styles.statusPill, { backgroundColor: statusBg(leave.status) }]}>
                  <Text style={[styles.statusText, { color: statusColor(leave.status) }]}>
                    {statusLabel(leave.status)}
                  </Text>
                </View>
              </View>
              <View style={[styles.actionCol, { flex: 1 }]}>
                {leave.status === "pending" ? (
                  <>
                    <Pressable
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => handleAction(leave.id, "approved")}
                    >
                      <Text style={styles.approveBtnText}>Approve</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => handleAction(leave.id, "rejected")}
                    >
                      <Text style={styles.rejectBtnText}>Reject</Text>
                    </Pressable>
                  </>
                ) : (
                  <Text style={styles.actionDone}>—</Text>
                )}
              </View>
            </View>
          ))}

          {filtered.length === 0 && (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>No leave requests found.</Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </AdminShell>
  );
}

/* ── Helpers ── */

const StatBox = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <View style={[styles.statBox, { borderTopColor: color }]}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const FilterBtn = ({
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

function leaveTypeLabel(type: string) {
  if (type === "day") return "Day Leave";
  if (type === "night") return "Night Leave";
  return "Vacation";
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
  });
}

/* ── Styles ── */

const styles = StyleSheet.create({
  scroll: {
    gap: 16,
    paddingBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderTopWidth: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  statLabel: {
    color: Colors.subtext,
    fontSize: 12,
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
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
  tableCard: {
    padding: 0,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: Colors.sidebarBg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  thText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableRowEven: {
    backgroundColor: Colors.surface,
  },
  cellText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "500",
  },
  cellName: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  cellSub: {
    color: Colors.subtext,
    fontSize: 11,
    fontWeight: "500",
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  actionCol: {
    flexDirection: "row",
    gap: 6,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  approveBtn: {
    backgroundColor: Colors.successLight,
  },
  approveBtnText: {
    color: Colors.success,
    fontSize: 11,
    fontWeight: "700",
  },
  rejectBtn: {
    backgroundColor: Colors.dangerLight,
  },
  rejectBtnText: {
    color: Colors.danger,
    fontSize: 11,
    fontWeight: "700",
  },
  actionDone: {
    color: Colors.muted,
    fontSize: 14,
    textAlign: "center",
  },
  emptyRow: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.subtext,
    fontSize: 13,
  },
});
