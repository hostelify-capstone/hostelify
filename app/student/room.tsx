import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { collections } from "@/services/firebase/firestore";
import type { RoomDetails } from "@/types";
import { query, where, onSnapshot } from "firebase/firestore";

export default function RoomScreen() {
  const { user } = useAuth();
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.roomNumber) { setLoading(false); return; }
    const q = query(collections.rooms, where("roomNumber", "==", user.roomNumber));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) setRoom({ id: snap.docs[0].id, ...snap.docs[0].data() } as RoomDetails);
      setLoading(false);
    });
    return () => unsub();
  }, [user?.roomNumber]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={Colors.primary} />;

  if (!room) return (
    <View style={styles.container}>
      <Text style={styles.heading}>Room Details</Text>
      <Card style={styles.card}><Text style={styles.empty}>No room assigned yet. Contact admin.</Text></Card>
    </View>
  );

  const statusColor = room.status === "available" ? Colors.success : room.status === "maintenance" ? Colors.warning : Colors.primary;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 12 }}>
      <Text style={styles.heading}>My Room</Text>

      <Card style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Room Number</Text>
          <Text style={styles.value}>{room.roomNumber}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Block</Text>
          <Text style={styles.value}>{room.block}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Floor</Text>
          <Text style={styles.value}>{room.floor}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Occupancy</Text>
          <Text style={styles.value}>{room.occupants.length} / {room.capacity}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <View style={[styles.badge, { backgroundColor: statusColor + "22", borderColor: statusColor }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{room.status}</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Roommates ({room.occupants.length - 1})</Text>
        {room.occupants.filter(id => id !== user?.id).length === 0
          ? <Text style={styles.empty}>No roommates assigned yet.</Text>
          : room.occupants.filter(id => id !== user?.id).map(id => (
              <Text key={id} style={styles.roommate}>• {id}</Text>
            ))
        }
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.background, padding: 16 },
  heading:      { color: Colors.text, fontSize: 22, fontWeight: "700", marginBottom: 4 },
  card:         { gap: 10 },
  row:          { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label:        { color: Colors.subtext, fontSize: 14 },
  value:        { color: Colors.text, fontSize: 14, fontWeight: "600" },
  divider:      { height: 1, backgroundColor: Colors.border },
  badge:        { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  badgeText:    { fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
  sectionTitle: { color: Colors.text, fontSize: 15, fontWeight: "700", marginBottom: 4 },
  roommate:     { color: Colors.subtext, fontSize: 14 },
  empty:        { color: Colors.muted, fontSize: 14 },
});