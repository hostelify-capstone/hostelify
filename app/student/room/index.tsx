import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { StudentShell } from "@/components/layout/StudentShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useRooms } from "@/hooks/useRooms";
import { useStudents } from "@/hooks/useStudents";

const CURRENT_STUDENT_ID = "stu-1";

export default function StudentRoomDetailsScreen() {
  const { rooms } = useRooms();
  const { students } = useStudents();
  const [requested, setRequested] = useState(false);

  const student = students.find((item) => item.id === CURRENT_STUDENT_ID) ?? students[0];

  const room = useMemo(
    () => rooms.find((item) => item.roomNumber === student?.roomNumber),
    [rooms, student?.roomNumber]
  );

  const roommates = useMemo(() => {
    if (!room) return [];
    return room.occupants
      .filter((id) => id !== CURRENT_STUDENT_ID)
      .map((id) => students.find((item) => item.id === id)?.name ?? id);
  }, [room, students]);

  return (
    <StudentShell title="Room Details" subtitle="Your room information and support contacts">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card style={styles.heroCard}>
          <Text style={styles.heroLabel}>Assigned Room</Text>
          <Text style={styles.heroValue}>{room?.roomNumber ?? "Not Assigned"}</Text>
          <Text style={styles.heroMeta}>
            Block {room?.block ?? "-"} • Floor {room?.floor ?? "-"}
          </Text>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Room Information</Text>
          <InfoRow label="Room Number" value={room?.roomNumber ?? "Not assigned"} />
          <InfoRow label="Building" value={`Block ${room?.block ?? "-"}`} />
          <InfoRow label="Capacity" value={`${room?.occupants.length ?? 0}/${room?.capacity ?? 0}`} />
          <View style={styles.rowDivider} />
          <Text style={styles.subHeading}>Roommates</Text>
          {roommates.length > 0 ? (
            roommates.map((mate) => (
              <View key={mate} style={styles.roommateItem}>
                <View style={styles.roommateDot} />
                <Text style={styles.roommateText}>{mate}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No roommates assigned yet.</Text>
          )}
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Warden Contact</Text>
          <InfoRow label="Name" value="Dr. Manish Verma" />
          <InfoRow label="Phone" value="+91 98765 43210" />
          <InfoRow label="Office" value="Block A Ground Floor" />
        </Card>

        <Button
          title={requested ? "Room Change Request Sent" : "Request Room Change"}
          variant={requested ? "success" : "primary"}
          onPress={() => {
            setRequested(true);
            Alert.alert("Request submitted", "Your room change request has been sent to the warden.");
          }}
        />
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
    gap: 14,
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    gap: 2,
  },
  heroLabel: {
    color: Colors.primaryLight,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  heroMeta: {
    color: "#e0e7ff",
    fontSize: 13,
    fontWeight: "500",
  },
  infoCard: {
    gap: 10,
    padding: 16,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  infoLabel: {
    color: Colors.subtext,
    fontSize: 13,
    fontWeight: "500",
  },
  infoValue: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  subHeading: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  roommateItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  roommateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  roommateText: {
    color: Colors.text,
    fontSize: 13,
  },
  emptyText: {
    color: Colors.subtext,
    fontSize: 13,
  },
});
