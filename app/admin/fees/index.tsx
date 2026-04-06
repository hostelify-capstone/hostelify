import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/Card";
import { FilterChips } from "@/components/ui/FilterChips";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SearchBar } from "@/components/ui/SearchBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Colors } from "@/constants/colors";
import { useFees } from "@/hooks/useFees";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
];

export default function AdminFeesScreen() {
  const { fees, updateFeeStatus, stats } = useFees();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return fees.filter((f) => {
      const matchesSearch =
        f.studentName.toLowerCase().includes(search.toLowerCase()) ||
        f.roomNumber.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || f.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [fees, search, statusFilter]);

  const statusColor = (status: string) => {
    switch (status) {
      case "paid": return Colors.success;
      case "pending": return Colors.warning;
      case "overdue": return Colors.danger;
      default: return Colors.subtext;
    }
  };

  const statusBg = (status: string) => {
    switch (status) {
      case "paid": return Colors.successLight;
      case "pending": return Colors.warningLight;
      case "overdue": return Colors.dangerLight;
      default: return Colors.surface;
    }
  };

  return (
    <AdminShell title="Fee Management">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            label="Total Collected"
            value={`₹${(stats.totalCollected / 1000).toFixed(0)}K`}
            icon="💵"
            iconBg={Colors.successLight}
          />
          <StatCard
            label="Total Pending"
            value={`₹${(stats.totalPending / 1000).toFixed(0)}K`}
            icon="⏳"
            iconBg={Colors.warningLight}
          />
          <StatCard label="Paid" value={stats.paid} icon="✅" iconBg={Colors.successLight} />
          <StatCard label="Overdue" value={stats.overdue} icon="🚨" iconBg={Colors.dangerLight} />
        </View>

        {/* Collection Progress */}
        <Card style={styles.progressCard}>
          <Text style={styles.progressTitle}>Collection Progress</Text>
          <Text style={styles.progressSubtitle}>Spring 2026 Semester</Text>
          <ProgressBar
            value={stats.totalCollected}
            maxValue={stats.totalCollected + stats.totalPending}
            color={Colors.success}
            label={`₹${stats.totalCollected.toLocaleString()} collected out of ₹${(stats.totalCollected + stats.totalPending).toLocaleString()}`}
          />
          <View style={styles.breakdownRow}>
            <BreakdownItem label="Paid" value={stats.paid} total={stats.total} color={Colors.success} />
            <BreakdownItem label="Pending" value={stats.pending} total={stats.total} color={Colors.warning} />
            <BreakdownItem label="Overdue" value={stats.overdue} total={stats.total} color={Colors.danger} />
          </View>
        </Card>

        <SectionHeader
          title="Payment Records"
          subtitle={`${filtered.length} records`}
        />

        {/* Filters */}
        <View style={styles.filtersRow}>
          <View style={styles.searchWrap}>
            <SearchBar value={search} onChangeText={setSearch} placeholder="Search by student or room..." />
          </View>
        </View>
        <FilterChips options={STATUS_FILTERS} selected={statusFilter} onSelect={setStatusFilter} />

        {/* Fee Table */}
        <Card style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.colStudent]}>Student</Text>
            <Text style={[styles.headerText, styles.colRoom]}>Room</Text>
            <Text style={[styles.headerText, styles.colAmount]}>Amount</Text>
            <Text style={[styles.headerText, styles.colDue]}>Due Date</Text>
            <Text style={[styles.headerText, styles.colStatus]}>Status</Text>
            <Text style={[styles.headerText, styles.colPaid]}>Paid On</Text>
            <Text style={[styles.headerText, styles.colAction]}>Action</Text>
          </View>

          {filtered.map((fee, idx) => (
            <View
              key={fee.id}
              style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}
            >
              <View style={[styles.colStudent, styles.studentCell]}>
                <View style={[styles.avatar, { backgroundColor: statusBg(fee.status) }]}>
                  <Text style={[styles.avatarText, { color: statusColor(fee.status) }]}>
                    {fee.studentName.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.studentName}>{fee.studentName}</Text>
              </View>
              <Text style={[styles.cellText, styles.colRoom]}>{fee.roomNumber}</Text>
              <Text style={[styles.cellText, styles.colAmount, styles.amountText]}>
                ₹{fee.amount.toLocaleString()}
              </Text>
              <Text style={[styles.cellText, styles.colDue]}>{fee.dueDate}</Text>
              <View style={styles.colStatus}>
                <View style={[styles.statusBadge, { backgroundColor: statusBg(fee.status) }]}>
                  <Text style={[styles.statusText, { color: statusColor(fee.status) }]}>
                    {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.cellText, styles.colPaid]}>
                {fee.paidDate ?? "—"}
              </Text>
              <View style={styles.colAction}>
                {fee.status !== "paid" ? (
                  <Pressable
                    style={styles.markPaidBtn}
                    onPress={() => updateFeeStatus(fee.id, "paid")}
                  >
                    <Text style={styles.markPaidText}>Mark Paid</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.revertBtn}
                    onPress={() => updateFeeStatus(fee.id, "pending")}
                  >
                    <Text style={styles.revertText}>Revert</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}

          {filtered.length === 0 && (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>No fee records found</Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </AdminShell>
  );
}

const BreakdownItem = ({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) => (
  <View style={styles.breakdownItem}>
    <View style={[styles.breakdownDot, { backgroundColor: color }]} />
    <Text style={styles.breakdownLabel}>{label}</Text>
    <Text style={[styles.breakdownValue, { color }]}>
      {value} ({total > 0 ? Math.round((value / total) * 100) : 0}%)
    </Text>
  </View>
);

const styles = StyleSheet.create({
  scroll: { gap: 16, paddingBottom: 24 },
  statsRow: { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  filtersRow: { flexDirection: "row", gap: 12 },
  searchWrap: { flex: 1, maxWidth: 400 },

  // Progress Card
  progressCard: { padding: 20, gap: 14 },
  progressTitle: { fontSize: 17, fontWeight: "700", color: Colors.text },
  progressSubtitle: { fontSize: 13, color: Colors.subtext },
  breakdownRow: {
    flexDirection: "row",
    gap: 24,
    marginTop: 4,
  },
  breakdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownLabel: {
    fontSize: 13,
    color: Colors.subtext,
    fontWeight: "500",
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: "700",
  },

  // Table
  tableCard: { padding: 0, overflow: "hidden" },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.subtext,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableRowAlt: {
    backgroundColor: Colors.surface,
  },

  // Columns
  colStudent: { flex: 3 },
  colRoom: { flex: 1.5 },
  colAmount: { flex: 2 },
  colDue: { flex: 2 },
  colStatus: { flex: 1.5 },
  colPaid: { flex: 2 },
  colAction: { flex: 1.5 },

  studentCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
  },
  studentName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  cellText: {
    fontSize: 14,
    color: Colors.text,
  },
  amountText: {
    fontWeight: "700",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  markPaidBtn: {
    backgroundColor: Colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  markPaidText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  revertBtn: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  revertText: {
    color: Colors.subtext,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyRow: {
    padding: 30,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.subtext,
    fontSize: 14,
  },
});
