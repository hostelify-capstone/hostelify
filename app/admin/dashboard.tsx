import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import { Colors } from "@/constants/colors";
import { useAdminComplaints } from "@/hooks/useAdminComplaints";
import { useFees } from "@/hooks/useFees";
import { useRooms } from "@/hooks/useRooms";
import { useStudents } from "@/hooks/useStudents";

export default function AdminDashboardScreen() {
  const { stats: studentStats } = useStudents();
  const { stats: roomStats } = useRooms();
  const { stats: complaintStats } = useAdminComplaints();
  const { stats: feeStats } = useFees();

  return (
    <AdminShell title="Dashboard">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Stat Cards Row */}
        <View style={styles.statsRow}>
          <StatCard
            label="Total Students"
            value={studentStats.total}
            icon="👥"
            iconBg={Colors.primaryLight}
            change={8}
          />
          <StatCard
            label="Total Rooms"
            value={roomStats.total}
            icon="🏠"
            iconBg={Colors.infoLight}
            change={2}
          />
          <StatCard
            label="Occupied Rooms"
            value={roomStats.occupied}
            icon="✅"
            iconBg={Colors.successLight}
            change={5}
          />
          <StatCard
            label="Pending Complaints"
            value={complaintStats.open}
            icon="⚠️"
            iconBg={Colors.warningLight}
            change={-12}
          />
        </View>

        {/* Charts Row */}
        <View style={styles.chartsRow}>
          {/* Room Occupancy */}
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Room Occupancy</Text>
            <Text style={styles.chartSubtitle}>Current capacity utilization</Text>
            <View style={styles.chartContent}>
              <View style={styles.donutPlaceholder}>
                <Text style={styles.donutValue}>
                  {roomStats.totalCapacity > 0
                    ? Math.round((roomStats.totalOccupants / roomStats.totalCapacity) * 100)
                    : 0}
                  %
                </Text>
                <Text style={styles.donutLabel}>Occupied</Text>
              </View>
              <View style={styles.legendCol}>
                <LegendItem color={Colors.primary} label="Occupied" value={roomStats.occupied} />
                <LegendItem color={Colors.success} label="Available" value={roomStats.available} />
                <LegendItem color={Colors.warning} label="Maintenance" value={roomStats.maintenance} />
              </View>
            </View>
          </Card>

          {/* Fee Collection */}
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Fee Collection</Text>
            <Text style={styles.chartSubtitle}>Spring 2026 semester</Text>
            <View style={styles.feeStats}>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Collected</Text>
                <Text style={[styles.feeValue, { color: Colors.success }]}>
                  ₹{(feeStats.totalCollected / 1000).toFixed(0)}K
                </Text>
              </View>
              <ProgressBar
                value={feeStats.totalCollected}
                maxValue={feeStats.totalCollected + feeStats.totalPending}
                color={Colors.success}
                label="Collection Progress"
              />
              <View style={styles.feeBreakdown}>
                <FeeStatItem label="Paid" value={feeStats.paid} color={Colors.success} />
                <FeeStatItem label="Pending" value={feeStats.pending} color={Colors.warning} />
                <FeeStatItem label="Overdue" value={feeStats.overdue} color={Colors.danger} />
              </View>
            </View>
          </Card>
        </View>

        {/* Bottom Row */}
        <View style={styles.chartsRow}>
          {/* Complaint Distribution */}
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Complaint Distribution</Text>
            <Text style={styles.chartSubtitle}>By category</Text>
            <View style={styles.barChart}>
              {Object.entries(complaintStats.byCategory).map(([cat, count]) => (
                <View key={cat} style={styles.barRow}>
                  <Text style={styles.barLabel}>{cat}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${(count / complaintStats.total) * 100}%`,
                          backgroundColor: getCategoryColor(cat),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barCount}>{count}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Quick Stats */}
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Quick Overview</Text>
            <Text style={styles.chartSubtitle}>At a glance</Text>
            <View style={styles.quickStats}>
              <QuickStatRow icon="📋" label="Open Complaints" value={complaintStats.open} color={Colors.warning} />
              <QuickStatRow icon="🔧" label="In Progress" value={complaintStats.inProgress} color={Colors.info} />
              <QuickStatRow icon="✅" label="Resolved" value={complaintStats.resolved} color={Colors.success} />
              <QuickStatRow icon="🔴" label="High Priority" value={complaintStats.highPriority} color={Colors.danger} />
              <QuickStatRow icon="💵" label="Fee Pending" value={feeStats.pending + feeStats.overdue} color={Colors.warning} />
              <QuickStatRow icon="🛏️" label="Beds Available" value={roomStats.totalCapacity - roomStats.totalOccupants} color={Colors.success} />
            </View>
          </Card>
        </View>
      </ScrollView>
    </AdminShell>
  );
}

/* ── Sub-Components ── */

const LegendItem = ({ color, label, value }: { color: string; label: string; value: number }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
    <Text style={styles.legendValue}>{value}</Text>
  </View>
);

const FeeStatItem = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <View style={styles.feeStatItem}>
    <View style={[styles.feeStatDot, { backgroundColor: color }]} />
    <Text style={styles.feeStatLabel}>{label}</Text>
    <Text style={[styles.feeStatValue, { color }]}>{value}</Text>
  </View>
);

const QuickStatRow = ({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) => (
  <View style={styles.quickRow}>
    <Text style={styles.quickIcon}>{icon}</Text>
    <Text style={styles.quickLabel}>{label}</Text>
    <View style={[styles.quickBadge, { backgroundColor: color + "18" }]}>
      <Text style={[styles.quickValue, { color }]}>{value}</Text>
    </View>
  </View>
);

const getCategoryColor = (cat: string): string => {
  const map: Record<string, string> = {
    Water: Colors.info,
    Electricity: Colors.warning,
    WiFi: "#ec4899",
    Maintenance: Colors.secondary,
    Mess: Colors.success,
  };
  return map[cat] ?? Colors.primary;
};

/* ── Styles ── */

const styles = StyleSheet.create({
  scroll: {
    gap: 20,
    paddingBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  chartsRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  chartCard: {
    flex: 1,
    minWidth: 340,
    padding: 20,
    gap: 4,
  },
  chartTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },
  chartSubtitle: {
    fontSize: 13,
    color: Colors.subtext,
    marginBottom: 16,
  },
  chartContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },

  // Donut placeholder
  donutPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 14,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
  },
  donutValue: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },
  donutLabel: {
    fontSize: 11,
    color: Colors.subtext,
    fontWeight: "600",
  },

  // Legend
  legendCol: {
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: "500",
    width: 90,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },

  // Fee Stats
  feeStats: {
    gap: 16,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feeLabel: {
    fontSize: 14,
    color: Colors.subtext,
    fontWeight: "500",
  },
  feeValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  feeBreakdown: {
    flexDirection: "row",
    gap: 20,
    marginTop: 4,
  },
  feeStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  feeStatDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  feeStatLabel: {
    fontSize: 13,
    color: Colors.subtext,
    fontWeight: "500",
  },
  feeStatValue: {
    fontSize: 14,
    fontWeight: "700",
  },

  // Bar Chart
  barChart: {
    gap: 12,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  barLabel: {
    width: 90,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
  },
  barTrack: {
    flex: 1,
    height: 20,
    backgroundColor: Colors.border,
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 6,
    minWidth: 12,
  },
  barCount: {
    width: 24,
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
  },

  // Quick Stats
  quickStats: {
    gap: 10,
  },
  quickRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  quickIcon: {
    fontSize: 18,
    width: 28,
    textAlign: "center",
  },
  quickLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  quickBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quickValue: {
    fontSize: 14,
    fontWeight: "700",
  },
});