import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StudentShell } from "@/components/layout/StudentShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Colors } from "@/constants/colors";
import { useFees } from "@/hooks/useFees";

const CURRENT_STUDENT_ID = "stu-1";

export default function StudentFeeManagementScreen() {
  const { fees, updateFeeStatus } = useFees();

  const studentFees = useMemo(
    () =>
      fees
        .filter((item) => item.studentId === CURRENT_STUDENT_ID)
        .sort((a, b) => (a.dueDate > b.dueDate ? -1 : 1)),
    [fees]
  );

  const totalAmount = studentFees.reduce((sum, item) => sum + item.amount, 0);
  const paidAmount = studentFees
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + item.amount, 0);

  const nextPending = studentFees.find((item) => item.status !== "paid");

  return (
    <StudentShell title="Fee Management" subtitle="Track your hostel fee payments">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Fee Summary</Text>
          <Text style={styles.totalValue}>₹{totalAmount.toLocaleString()}</Text>
          <Text style={styles.totalSub}>Total semester dues</Text>
          <ProgressBar
            value={paidAmount}
            maxValue={totalAmount}
            color={Colors.success}
            label="Paid Progress"
          />
          <View style={styles.summaryMeta}>
            <MetaPill label="Paid" value={`₹${paidAmount.toLocaleString()}`} tone="success" />
            <MetaPill label="Pending" value={`₹${(totalAmount - paidAmount).toLocaleString()}`} tone="warning" />
          </View>
          {nextPending ? (
            <Button
              title="Pay Pending Fee"
              onPress={() => updateFeeStatus(nextPending.id, "paid")}
            />
          ) : (
            <Button title="All Fees Paid" variant="success" onPress={() => undefined} />
          )}
        </Card>

        <Card style={styles.historyCard}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          {studentFees.map((fee) => (
            <View key={fee.id} style={styles.historyItem}>
              <View>
                <Text style={styles.semester}>{fee.semester}</Text>
                <Text style={styles.meta}>Due: {fee.dueDate}</Text>
                <Text style={styles.meta}>Paid: {fee.paidDate ?? "-"}</Text>
              </View>
              <View style={styles.rightCol}>
                <Text style={styles.amount}>₹{fee.amount.toLocaleString()}</Text>
                <Badge label={fee.status.toUpperCase()} tone={statusTone(fee.status)} />
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </StudentShell>
  );
}

const MetaPill = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning";
}) => (
  <View style={[styles.metaPill, tone === "success" ? styles.successPill : styles.warningPill]}>
    <Text style={[styles.metaLabel, tone === "success" ? styles.successText : styles.warningText]}>{label}</Text>
    <Text style={[styles.metaValue, tone === "success" ? styles.successText : styles.warningText]}>{value}</Text>
  </View>
);

function statusTone(status: "paid" | "pending" | "overdue") {
  if (status === "paid") return "success" as const;
  if (status === "pending") return "warning" as const;
  return "danger" as const;
}

const styles = StyleSheet.create({
  scroll: {
    gap: 14,
    paddingBottom: 24,
  },
  summaryCard: {
    gap: 10,
    padding: 16,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  totalValue: {
    color: Colors.text,
    fontSize: 30,
    fontWeight: "800",
  },
  totalSub: {
    color: Colors.subtext,
    fontSize: 12,
    marginTop: -2,
  },
  summaryMeta: {
    flexDirection: "row",
    gap: 10,
  },
  metaPill: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 2,
  },
  successPill: {
    backgroundColor: Colors.successLight,
  },
  warningPill: {
    backgroundColor: Colors.warningLight,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  successText: {
    color: Colors.success,
  },
  warningText: {
    color: Colors.warning,
  },
  historyCard: {
    gap: 12,
    padding: 16,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
  },
  semester: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  meta: {
    color: Colors.subtext,
    fontSize: 12,
  },
  rightCol: {
    alignItems: "flex-end",
    gap: 6,
  },
  amount: {
    color: Colors.text,
    fontWeight: "800",
    fontSize: 15,
  },
});
