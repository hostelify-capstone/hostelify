import { Link } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import { Colors } from "@/constants/colors";
import { useComplaints } from "@/hooks/useComplaints";
import { useFees } from "@/hooks/useFees";
import { useMess } from "@/hooks/useMess";
import { useNotices } from "@/hooks/useNotices";
import { useRooms } from "@/hooks/useRooms";
import { useStudents } from "@/hooks/useStudents";

const CURRENT_STUDENT_ID = "stu-1";

const quickActions = [
  { title: "Raise Complaint", href: "/student/complaints/new" as const },
  { title: "Pay Fees", href: "/student/fees" as const },
  { title: "View Notices", href: "/student/notices" as const },
];

export default function StudentDashboardScreen() {
  const { students } = useStudents();
  const { rooms } = useRooms();
  const { fees } = useFees();
  const { complaints } = useComplaints();
  const { notices } = useNotices();
  const { menu } = useMess();

  const student = students.find((item) => item.id === CURRENT_STUDENT_ID) ?? students[0];

  const room = useMemo(
    () => rooms.find((item) => item.roomNumber === student?.roomNumber),
    [rooms, student?.roomNumber]
  );

  const studentFees = fees.filter((item) => item.studentId === CURRENT_STUDENT_ID);
  const paidFees = studentFees.filter((item) => item.status === "paid").length;
  const studentComplaints = complaints.filter((item) => item.createdBy === CURRENT_STUDENT_ID);
  const activeComplaints = studentComplaints.filter((item) => item.status !== "resolved").length;
  const latestNotices = [...notices].sort((a, b) => (a.postedAt > b.postedAt ? -1 : 1)).slice(0, 3);
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayMenu = menu.find((item) => item.day === todayName) ?? menu[0];
  const feeCompletion = studentFees.length > 0 ? Math.round((paidFees / studentFees.length) * 100) : 0;
  const pendingFees = studentFees.filter((item) => item.status !== "paid").length;

  return (
    <StudentShell title="Dashboard">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.headerBlock}>
          <Text style={styles.welcome}>Welcome back, {student?.name ?? "Student"}</Text>
          <Text style={styles.subtitle}>Your hostel overview for today</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            label="Room Details"
            value={room?.roomNumber ?? "N/A"}
            icon={<Ionicons name="home" size={22} color={Colors.info} />}
            iconBg={Colors.infoLight}
          />
          <StatCard
            label="Fee Status"
            value={`${feeCompletion}%`}
            icon={<Ionicons name="wallet" size={22} color={Colors.success} />}
            iconBg={Colors.successLight}
          />
          <StatCard
            label="Active Complaints"
            value={activeComplaints}
            icon={<Ionicons name="clipboard" size={22} color={Colors.warning} />}
            iconBg={Colors.warningLight}
          />
          <StatCard
            label="Latest Notices"
            value={latestNotices.length}
            icon={<Ionicons name="megaphone" size={22} color={Colors.primary} />}
            iconBg={Colors.primaryLight}
          />
          <StatCard
            label="Today's Mess Menu"
            value={todayMenu?.day ?? "Today"}
            icon={<Ionicons name="restaurant" size={22} color={Colors.secondary} />}
            iconBg={Colors.secondaryLight}
          />
        </View>

        <View style={styles.row}>
          <Card style={styles.largeCard}>
            <Text style={styles.sectionTitle}>Room & Fee Summary</Text>
            <Text style={styles.sectionSub}>Current room and semester dues</Text>

            <View style={styles.infoRows}>
              <InfoRow label="Room" value={`${room?.roomNumber ?? "-"} (Block ${room?.block ?? "-"})`} />
              <InfoRow label="Occupancy" value={`${room?.occupants.length ?? 0}/${room?.capacity ?? 0}`} />
              <InfoRow label="Paid Installments" value={`${paidFees}/${studentFees.length || 0}`} />
              <InfoRow label="Pending Installments" value={`${pendingFees}`} />
            </View>

            <ProgressBar
              value={paidFees}
              maxValue={studentFees.length || 1}
              color={Colors.success}
              label="Fee Completion"
            />
          </Card>

          <Card style={styles.largeCard}>
            <Text style={styles.sectionTitle}>Latest Notices</Text>
            <Text style={styles.sectionSub}>Important updates from hostel administration</Text>
            <View style={styles.noticeList}>
              {latestNotices.map((notice) => (
                <View key={notice.id} style={styles.noticeItem}>
                  <Text style={styles.noticeTitle}>{notice.title}</Text>
                  <Text style={styles.noticeMeta}>{notice.category ?? "General"}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={styles.row}>
          <Card style={styles.largeCard}>
            <Text style={styles.sectionTitle}>Today's Mess Menu</Text>
            <Text style={styles.sectionSub}>{todayMenu?.day ?? "Today"}</Text>
            <View style={styles.menuRows}>
              <InfoRow label="Breakfast" value={todayMenu?.breakfast ?? "-"} />
              <InfoRow label="Lunch" value={todayMenu?.lunch ?? "-"} />
              <InfoRow label="Snacks" value={todayMenu?.snacks ?? "-"} />
              <InfoRow label="Dinner" value={todayMenu?.dinner ?? "-"} />
            </View>
          </Card>

          <Card style={styles.largeCard}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionSub}>Frequently used student tasks</Text>
            <View style={styles.quickActions}>
              {quickActions.map((action) => (
                <Link href={action.href as any} asChild key={action.title}>
                  <Pressable style={styles.quickBtn}>
                    <Text style={styles.quickBtnText}>{action.title}</Text>
                  </Pressable>
                </Link>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </StudentShell>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  scroll: {
    gap: 16,
    paddingBottom: 24,
  },
  headerBlock: {
    gap: 2,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.subtext,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  largeCard: {
    flex: 1,
    minWidth: 360,
    padding: 20,
    gap: 10,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSub: {
    fontSize: 13,
    color: Colors.subtext,
  },
  infoRows: {
    gap: 8,
    marginVertical: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.subtext,
    width: 130,
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
  },
  noticeList: {
    gap: 8,
    marginTop: 4,
  },
  noticeItem: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.surface,
  },
  noticeTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  noticeMeta: {
    marginTop: 2,
    color: Colors.subtext,
    fontSize: 12,
    fontWeight: "500",
  },
  menuRows: {
    gap: 8,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  quickBtn: {
    minWidth: 160,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  quickBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});