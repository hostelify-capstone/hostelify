import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/Card";
import { FilterChips } from "@/components/ui/FilterChips";
import { SearchBar } from "@/components/ui/SearchBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Colors } from "@/constants/colors";
import { ComplaintPriorities } from "@/constants/complaintPriorities";
import { useAdminComplaints } from "@/hooks/useAdminComplaints";
import type { Complaint } from "@/types";
import type { ComplaintPriority } from "@/constants/complaintPriorities";
import { formatDateTime } from "@/utils/formatters";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in-progress" },
  { label: "Resolved", value: "resolved" },
];

const PRIORITY_FILTERS = [
  { label: "All Priority", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const STATUS_FLOW: Complaint["status"][] = ["open", "in-progress", "resolved"];

export default function AdminComplaintsScreen() {
  const { complaints, updateStatus, updatePriority, stats } = useAdminComplaints();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        (c.studentName ?? "").toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || c.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [complaints, search, statusFilter, priorityFilter]);

  const getStatusColor = (status: Complaint["status"]) => {
    switch (status) {
      case "open": return Colors.warning;
      case "in-progress": return Colors.info;
      case "resolved": return Colors.success;
    }
  };

  const getStatusBg = (status: Complaint["status"]) => {
    switch (status) {
      case "open": return Colors.warningLight;
      case "in-progress": return Colors.infoLight;
      case "resolved": return Colors.successLight;
    }
  };

  const getPriorityColor = (priority: ComplaintPriority) => {
    switch (priority) {
      case "critical": return Colors.danger;
      case "high": return "#dc2626";
      case "medium": return Colors.warning;
      case "low": return Colors.success;
    }
  };

  const getNextStatus = (current: Complaint["status"]): Complaint["status"] | null => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  const cyclePriority = (current: ComplaintPriority): ComplaintPriority => {
    const priorities: ComplaintPriority[] = [
      ComplaintPriorities.LOW,
      ComplaintPriorities.MEDIUM,
      ComplaintPriorities.HIGH,
      ComplaintPriorities.CRITICAL,
    ];
    const idx = priorities.indexOf(current);
    return priorities[(idx + 1) % priorities.length];
  };

  return (
    <AdminShell title="Complaint Management">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard label="Total Complaints" value={stats.total} icon="📋" iconBg={Colors.primaryLight} />
          <StatCard label="Open" value={stats.open} icon="📝" iconBg={Colors.warningLight} />
          <StatCard label="In Progress" value={stats.inProgress} icon="🔄" iconBg={Colors.infoLight} />
          <StatCard label="Resolved" value={stats.resolved} icon="✅" iconBg={Colors.successLight} />
        </View>

        <SectionHeader
          title="All Complaints"
          subtitle={`${filtered.length} complaints found`}
        />

        {/* Search & Filters */}
        <View style={styles.filtersRow}>
          <View style={styles.searchWrap}>
            <SearchBar value={search} onChangeText={setSearch} placeholder="Search complaints..." />
          </View>
        </View>
        <FilterChips options={STATUS_FILTERS} selected={statusFilter} onSelect={setStatusFilter} />
        <FilterChips options={PRIORITY_FILTERS} selected={priorityFilter} onSelect={setPriorityFilter} />

        {/* Complaint Cards */}
        <View style={styles.list}>
          {filtered.map((complaint) => {
            const nextStatus = getNextStatus(complaint.status);
            return (
              <Card key={complaint.id} style={styles.complaintCard}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleWrap}>
                    <Text style={styles.cardTitle}>{complaint.title}</Text>
                    <Text style={styles.cardId}>#{complaint.id}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusBg(complaint.status) }]}>
                    <Text style={[styles.statusBadgeText, { color: getStatusColor(complaint.status) }]}>
                      {complaint.status === "in-progress"
                        ? "In Progress"
                        : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.description}>{complaint.description}</Text>

                {/* Meta */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>👤</Text>
                    <Text style={styles.metaText}>{complaint.studentName ?? "Unknown"}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>🏠</Text>
                    <Text style={styles.metaText}>{complaint.roomNumber ?? "—"}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>📁</Text>
                    <Text style={styles.metaText}>{complaint.category}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>🕐</Text>
                    <Text style={styles.metaText}>{formatDateTime(complaint.createdAt)}</Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsRow}>
                  {/* Priority Badge */}
                  <Pressable
                    style={[styles.priorityBadge, { borderColor: getPriorityColor(complaint.priority) }]}
                    onPress={() => updatePriority(complaint.id, cyclePriority(complaint.priority))}
                  >
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(complaint.priority) }]} />
                    <Text style={[styles.priorityText, { color: getPriorityColor(complaint.priority) }]}>
                      {complaint.priority.toUpperCase()}
                    </Text>
                  </Pressable>

                  {/* Status Action */}
                  {nextStatus && (
                    <Pressable
                      style={styles.advanceBtn}
                      onPress={() => updateStatus(complaint.id, nextStatus)}
                    >
                      <Text style={styles.advanceBtnText}>
                        Move to → {nextStatus === "in-progress" ? "In Progress" : "Resolved"}
                      </Text>
                    </Pressable>
                  )}

                  {complaint.status === "resolved" && (
                    <View style={styles.resolvedTag}>
                      <Text style={styles.resolvedText}>✅ Resolved</Text>
                    </View>
                  )}
                </View>
              </Card>
            );
          })}

          {filtered.length === 0 && (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No complaints match your filters</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: 16, paddingBottom: 24 },
  statsRow: { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  filtersRow: { flexDirection: "row", gap: 12 },
  searchWrap: { flex: 1, maxWidth: 400 },

  list: { gap: 14 },

  complaintCard: {
    padding: 18,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  cardTitleWrap: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  cardId: {
    fontSize: 12,
    color: Colors.muted,
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    color: Colors.subtext,
    lineHeight: 20,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: "500",
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  advanceBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  advanceBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  resolvedTag: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resolvedText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.success,
  },

  emptyWrap: {
    alignItems: "center",
    padding: 40,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.subtext,
  },
});