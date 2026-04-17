import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { collections } from "@/services/firebase/firestore";
import type { Fee } from "@/types";
import { onSnapshot, query, where } from "firebase/firestore";

const STATUS_MAP = {
  paid:    { color: Colors.success,  bg: Colors.successLight,  label: "Paid" },
  pending: { color: Colors.warning,  bg: Colors.warningLight,  label: "Pending" },
  overdue: { color: Colors.danger,   bg: Colors.dangerLight,   label: "Overdue" },
};

export default function StudentFeesScreen() {
  const { user } = useAuth();
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const q = query(collections.fees, where("studentId", "==", user.id));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Fee));
      data.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
      setFees(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user?.id]);

  const totalDue = fees.filter(f => f.status !== "paid").reduce((s, f) => s + f.amount, 0);
  const totalPaid = fees.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={Colors.primary} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 14 }}>
      <Text style={styles.heading}>My Fees</Text>

      {/* Summary */}
      {fees.length > 0 && (
        <View style={styles.summaryRow}>
          <Card style={[styles.summaryCard, { borderLeftColor: Colors.success }]}>
            <Text style={styles.summaryLabel}>Total Paid</Text>
            <Text style={[styles.summaryAmount, { color: Colors.success }]}>₹{totalPaid.toLocaleString()}</Text>
          </Card>
          <Card style={[styles.summaryCard, { borderLeftColor: Colors.danger }]}>
            <Text style={styles.summaryLabel}>Total Due</Text>
            <Text style={[styles.summaryAmount, { color: Colors.danger }]}>₹{totalDue.toLocaleString()}</Text>
          </Card>
        </View>
      )}

      {/* Fee records */}
      {fees.length === 0 ? (
        <Card style={styles.card}>
          <Text style={styles.empty}>No fee records found.</Text>
          <Text style={styles.emptyHint}>Contact the admin if you believe this is an error.</Text>
        </Card>
      ) : fees.map(fee => {
        const s = STATUS_MAP[fee.status];
        return (
          <Card key={fee.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.semester}>{fee.semester}</Text>
              <View style={[styles.badge, { backgroundColor: s.bg, borderColor: s.color }]}>
                <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
              </View>
            </View>

            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Amount</Text>
              <Text style={styles.amount}>₹{fee.amount.toLocaleString()}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.meta}>Due Date</Text>
              <Text style={styles.metaValue}>{fee.dueDate}</Text>
            </View>
            {fee.paidDate && (
              <View style={styles.row}>
                <Text style={styles.meta}>Paid On</Text>
                <Text style={[styles.metaValue, { color: Colors.success }]}>{fee.paidDate}</Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.meta}>Room</Text>
              <Text style={styles.metaValue}>{fee.roomNumber}</Text>
            </View>

            {fee.status !== "paid" && (
              <View style={styles.payNotice}>
                <Text style={styles.payNoticeText}>
                  💳 To pay, visit the hostel office or use the online payment portal. Show this record to admin.
                </Text>
              </View>
            )}
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Colors.background, padding: 16 },
  heading:       { color: Colors.text, fontSize: 22, fontWeight: "700", marginBottom: 4 },
  summaryRow:    { flexDirection: "row", gap: 12 },
  summaryCard:   { flex: 1, borderLeftWidth: 4, paddingVertical: 12 },
  summaryLabel:  { color: Colors.subtext, fontSize: 12 },
  summaryAmount: { fontSize: 20, fontWeight: "700", marginTop: 4 },
  card:          { gap: 8 },
  row:           { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  semester:      { color: Colors.text, fontWeight: "700", fontSize: 15 },
  badge:         { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  badgeText:     { fontSize: 12, fontWeight: "600" },
  amountRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  amountLabel:   { color: Colors.subtext, fontSize: 13 },
  amount:        { color: Colors.text, fontSize: 24, fontWeight: "700" },
  divider:       { height: 1, backgroundColor: Colors.border },
  meta:          { color: Colors.subtext, fontSize: 13 },
  metaValue:     { color: Colors.text, fontSize: 13, fontWeight: "600" },
  payNotice:     { backgroundColor: Colors.infoLight, borderRadius: 8, padding: 10, marginTop: 4 },
  payNoticeText: { color: Colors.info, fontSize: 12 },
  empty:         { color: Colors.text, fontSize: 15, fontWeight: "600", textAlign: "center" },
  emptyHint:     { color: Colors.muted, fontSize: 13, textAlign: "center" },
});
