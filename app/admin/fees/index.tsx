import React, { useMemo, useState } from "react";
import {
  Alert, Modal, Pressable, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/Card";
import { FilterChips } from "@/components/ui/FilterChips";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SearchBar } from "@/components/ui/SearchBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Colors } from "@/constants/colors";
import { useFees } from "@/hooks/useFees";
import { useStudents } from "@/hooks/useStudents";
import { db } from "@/services/firebase/config";
import { addDoc, collection } from "firebase/firestore";
import type { Fee } from "@/types";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
];

const SEMESTERS = ["Spring 2026", "Fall 2025", "Spring 2025", "Fall 2024"];

export default function AdminFeesScreen() {
  const { fees, updateFeeStatus, deleteFee, stats } = useFees();
  const { students } = useStudents();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selStudentId, setSelStudentId] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formSemester, setFormSemester] = useState("Spring 2026");
  const [formDueDate, setFormDueDate] = useState("");
  const [formStatus, setFormStatus] = useState<"pending" | "paid" | "overdue">("pending");

  const filtered = useMemo(() =>
    fees.filter((f) => {
      const q = search.toLowerCase();
      return (
        (f.studentName.toLowerCase().includes(q) || f.roomNumber.toLowerCase().includes(q)) &&
        (statusFilter === "all" || f.status === statusFilter)
      );
    }),
    [fees, search, statusFilter]
  );

  const statusColor = (s: string) => ({ paid: Colors.success, pending: Colors.warning, overdue: Colors.danger }[s] ?? Colors.subtext);
  const statusBg = (s: string) => ({ paid: Colors.successLight, pending: Colors.warningLight, overdue: Colors.dangerLight }[s] ?? Colors.surface);

  const resetForm = () => {
    setSelStudentId(""); setFormAmount(""); setFormDueDate(""); setFormStatus("pending"); setFormSemester("Spring 2026");
  };

  const handleAddFee = async () => {
    const student = students.find(s => s.id === selStudentId);
    if (!student) { Alert.alert("Error", "Please select a student."); return; }
    const amount = parseFloat(formAmount);
    if (!amount || amount <= 0) { Alert.alert("Error", "Please enter a valid amount."); return; }
    if (!formDueDate.match(/^\d{4}-\d{2}-\d{2}$/)) { Alert.alert("Error", "Due date must be in YYYY-MM-DD format (e.g. 2026-05-31)."); return; }

    setSaving(true);
    try {
      const feeDoc: Omit<Fee, "id"> = {
        studentId: student.id,
        studentName: student.name,
        roomNumber: student.roomNumber ?? "—",
        amount,
        semester: formSemester,
        dueDate: formDueDate,
        status: formStatus,
        ...(formStatus === "paid" ? { paidDate: new Date().toISOString().split("T")[0] } : {}),
      };
      await addDoc(collection(db, "fees"), feeDoc);
      setModalVisible(false);
      resetForm();
      Alert.alert("✅ Fee Added", `Fee record created for ${student.name}.`);
    } catch (e: any) {
      Alert.alert("Error", `Failed to add fee: ${e?.message ?? "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell title="Fee Management">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard label="Total Collected" value={`₹${(stats.totalCollected / 1000).toFixed(0)}K`} icon="💵" iconBg={Colors.successLight} />
          <StatCard label="Total Pending" value={`₹${(stats.totalPending / 1000).toFixed(0)}K`} icon="⏳" iconBg={Colors.warningLight} />
          <StatCard label="Paid" value={stats.paid} icon="✅" iconBg={Colors.successLight} />
          <StatCard label="Overdue" value={stats.overdue} icon="🚨" iconBg={Colors.dangerLight} />
        </View>

        {/* Collection Progress */}
        {(stats.totalCollected + stats.totalPending) > 0 && (
          <Card style={styles.progressCard}>
            <Text style={styles.progressTitle}>Collection Progress</Text>
            <ProgressBar
              value={stats.totalCollected}
              maxValue={stats.totalCollected + stats.totalPending}
              color={Colors.success}
              label={`₹${stats.totalCollected.toLocaleString()} of ₹${(stats.totalCollected + stats.totalPending).toLocaleString()}`}
            />
            <View style={styles.breakdownRow}>
              <BreakdownItem label="Paid" value={stats.paid} total={stats.total} color={Colors.success} />
              <BreakdownItem label="Pending" value={stats.pending} total={stats.total} color={Colors.warning} />
              <BreakdownItem label="Overdue" value={stats.overdue} total={stats.total} color={Colors.danger} />
            </View>
          </Card>
        )}

        <SectionHeader
          title="Payment Records"
          subtitle={`${filtered.length} records`}
          rightElement={
            <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.addBtnText}>+ Add Fee</Text>
            </TouchableOpacity>
          }
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
            <Text style={[styles.th, styles.cStudent]}>Student</Text>
            <Text style={[styles.th, styles.cRoom]}>Room</Text>
            <Text style={[styles.th, styles.cAmount]}>Amount</Text>
            <Text style={[styles.th, styles.cDue]}>Due Date</Text>
            <Text style={[styles.th, styles.cStatus]}>Status</Text>
            <Text style={[styles.th, styles.cPaid]}>Paid On</Text>
            <Text style={[styles.th, styles.cAction]}>Action</Text>
          </View>

          {filtered.map((fee, idx) => (
            <View key={fee.id} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
              <View style={[styles.cStudent, styles.studentCell]}>
                <View style={[styles.avatar, { backgroundColor: statusBg(fee.status) }]}>
                  <Text style={[styles.avatarTxt, { color: statusColor(fee.status) }]}>
                    {fee.studentName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.studentName}>{fee.studentName}</Text>
              </View>
              <Text style={[styles.td, styles.cRoom]}>{fee.roomNumber}</Text>
              <Text style={[styles.td, styles.cAmount, { fontWeight: "700" }]}>₹{fee.amount.toLocaleString()}</Text>
              <Text style={[styles.td, styles.cDue]}>{fee.dueDate}</Text>
              <View style={styles.cStatus}>
                <View style={[styles.badge, { backgroundColor: statusBg(fee.status) }]}>
                  <Text style={[styles.badgeTxt, { color: statusColor(fee.status) }]}>
                    {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.td, styles.cPaid]}>{fee.paidDate ?? "—"}</Text>
              <View style={[styles.cAction, { flexDirection: "row", gap: 6 }]}>
                {fee.status !== "paid" ? (
                  <Pressable style={styles.markPaidBtn} onPress={() => updateFeeStatus(fee.id, "paid")}>
                    <Text style={styles.markPaidTxt}>Mark Paid</Text>
                  </Pressable>
                ) : (
                  <Pressable style={styles.revertBtn} onPress={() => updateFeeStatus(fee.id, "pending")}>
                    <Text style={styles.revertTxt}>Revert</Text>
                  </Pressable>
                )}
                <Pressable style={styles.delBtn} onPress={() => deleteFee(fee.id)}>
                  <Text style={styles.delTxt}>🗑️</Text>
                </Pressable>
              </View>
            </View>
          ))}

          {filtered.length === 0 && (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyTxt}>
                {fees.length === 0 ? "No fee records yet. Click \"+ Add Fee\" to create one." : "No records match your filter."}
              </Text>
            </View>
          )}
        </Card>
      </ScrollView>

      {/* ── Add Fee Modal ── */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Fee Record</Text>

            {/* Student Picker */}
            <Text style={styles.label}>Select Student *</Text>
            <View style={styles.pickerBox}>
              {students.length === 0 ? (
                <Text style={styles.noData}>No students registered yet</Text>
              ) : (
                students.map(s => (
                  <Pressable
                    key={s.id}
                    style={[styles.pickOpt, selStudentId === s.id && styles.pickOptActive]}
                    onPress={() => setSelStudentId(s.id)}
                  >
                    <Text style={[styles.pickTxt, selStudentId === s.id && { color: "#fff", fontWeight: "700" }]}>
                      {s.name}{s.roomNumber ? ` · ${s.roomNumber}` : ""}
                    </Text>
                  </Pressable>
                ))
              )}
            </View>

            {/* Semester */}
            <Text style={styles.label}>Semester</Text>
            <View style={styles.semRow}>
              {SEMESTERS.map(sem => (
                <Pressable
                  key={sem}
                  style={[styles.semOpt, formSemester === sem && styles.semOptActive]}
                  onPress={() => setFormSemester(sem)}
                >
                  <Text style={[styles.semTxt, formSemester === sem && { color: "#fff" }]}>{sem}</Text>
                </Pressable>
              ))}
            </View>

            {/* Amount */}
            <Text style={styles.label}>Amount (₹) *</Text>
            <TextInput
              style={styles.input}
              value={formAmount}
              onChangeText={setFormAmount}
              keyboardType="numeric"
              placeholder="e.g. 25000"
              placeholderTextColor={Colors.muted}
            />

            {/* Due Date */}
            <Text style={styles.label}>Due Date * (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={formDueDate}
              onChangeText={setFormDueDate}
              placeholder="2026-05-31"
              placeholderTextColor={Colors.muted}
            />

            {/* Status */}
            <Text style={styles.label}>Initial Status</Text>
            <View style={styles.statusRow}>
              {(["pending", "paid", "overdue"] as const).map(s => (
                <Pressable
                  key={s}
                  style={[styles.statusOpt, formStatus === s && { backgroundColor: statusColor(s), borderColor: statusColor(s) }]}
                  onPress={() => setFormStatus(s)}
                >
                  <Text style={[styles.statusTxt, formStatus === s && { color: "#fff" }]}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelBtn} onPress={() => { setModalVisible(false); resetForm(); }}>
                <Text style={styles.cancelTxt}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.submitBtn, saving && { opacity: 0.6 }]} onPress={handleAddFee} disabled={saving}>
                <Text style={styles.submitTxt}>{saving ? "Saving…" : "Add Fee"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </AdminShell>
  );
}

/* Sub-component */
const BreakdownItem = ({ label, value, total, color }: { label: string; value: number; total: number; color: string }) => (
  <View style={styles.bdItem}>
    <View style={[styles.bdDot, { backgroundColor: color }]} />
    <Text style={styles.bdLabel}>{label}</Text>
    <Text style={[styles.bdValue, { color }]}>{value} ({total > 0 ? Math.round((value / total) * 100) : 0}%)</Text>
  </View>
);

const styles = StyleSheet.create({
  scroll: { gap: 16, paddingBottom: 24 },
  statsRow: { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  filtersRow: { flexDirection: "row", gap: 12 },
  searchWrap: { flex: 1, maxWidth: 400 },
  addBtn: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10 },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  progressCard: { padding: 20, gap: 12 },
  progressTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  breakdownRow: { flexDirection: "row", gap: 20, marginTop: 4 },
  bdItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  bdDot: { width: 8, height: 8, borderRadius: 4 },
  bdLabel: { fontSize: 13, color: Colors.subtext, fontWeight: "500" },
  bdValue: { fontSize: 13, fontWeight: "700" },

  tableCard: { padding: 0, overflow: "hidden" },
  tableHeader: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.surface, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  th: { fontSize: 11, fontWeight: "700", color: Colors.subtext, textTransform: "uppercase", letterSpacing: 0.5 },
  tableRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tableRowAlt: { backgroundColor: Colors.surface },
  td: { fontSize: 13, color: Colors.text },

  cStudent: { flex: 3 }, cRoom: { flex: 1.5 }, cAmount: { flex: 2 },
  cDue: { flex: 2 }, cStatus: { flex: 1.5 }, cPaid: { flex: 2 }, cAction: { flex: 2 },

  studentCell: { flexDirection: "row", alignItems: "center", gap: 8 },
  avatar: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  avatarTxt: { fontSize: 13, fontWeight: "700" },
  studentName: { fontSize: 13, fontWeight: "600", color: Colors.text },

  badge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeTxt: { fontSize: 11, fontWeight: "700" },

  markPaidBtn: { backgroundColor: Colors.success, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  markPaidTxt: { color: "#fff", fontSize: 11, fontWeight: "700" },
  revertBtn: { backgroundColor: Colors.surface, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: Colors.border },
  revertTxt: { color: Colors.subtext, fontSize: 11, fontWeight: "600" },
  delBtn: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6, backgroundColor: Colors.dangerLight },
  delTxt: { fontSize: 12 },

  emptyRow: { padding: 32, alignItems: "center" },
  emptyTxt: { color: Colors.subtext, fontSize: 14, textAlign: "center" },

  // Modal
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "center", alignItems: "center", padding: 20 },
  modal: { backgroundColor: Colors.card, borderRadius: 20, padding: 24, width: "100%", maxWidth: 520, gap: 10 },
  modalTitle: { fontSize: 20, fontWeight: "800", color: Colors.text, marginBottom: 4 },
  label: { fontSize: 12, fontWeight: "700", color: Colors.subtext, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 },

  pickerBox: { borderWidth: 1, borderColor: Colors.border, borderRadius: 10, overflow: "hidden", maxHeight: 160 },
  pickOpt: { padding: 10, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.surface },
  pickOptActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  pickTxt: { fontSize: 13, color: Colors.text },
  noData: { padding: 12, color: Colors.muted, fontSize: 13 },

  semRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  semOpt: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  semOptActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  semTxt: { fontSize: 12, fontWeight: "600", color: Colors.text },

  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 11, fontSize: 14, color: Colors.text },

  statusRow: { flexDirection: "row", gap: 8 },
  statusOpt: { flex: 1, padding: 9, borderRadius: 8, borderWidth: 1.5, borderColor: Colors.border, alignItems: "center", backgroundColor: Colors.surface },
  statusTxt: { fontSize: 13, fontWeight: "600", color: Colors.subtext },

  modalActions: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, alignItems: "center" },
  cancelTxt: { color: Colors.subtext, fontWeight: "600" },
  submitBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: Colors.primary, alignItems: "center" },
  submitTxt: { color: "#fff", fontWeight: "700" },
});
