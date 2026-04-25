import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { collections } from "@/services/firebase/firestore";
import { db } from "@/services/firebase/config";
import type { RoomDetails } from "@/types";
import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";

type RoomRequest = {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  roomId: string;
  roomNumber: string;
  block: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export default function RoomBookingScreen() {
  const { user } = useAuth();
  const [myRoom, setMyRoom] = useState<RoomDetails | null>(null);
  const [availableRooms, setAvailableRooms] = useState<RoomDetails[]>([]);
  const [pendingRequest, setPendingRequest] = useState<RoomRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);

  // Watch my current room
  useEffect(() => {
    if (!user?.roomNumber) { setLoading(false); return; }
    const q = query(collections.rooms, where("roomNumber", "==", user.roomNumber));
    return onSnapshot(q, snap => {
      setMyRoom(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() } as RoomDetails);
      setLoading(false);
    });
  }, [user?.roomNumber]);

  // Watch available rooms
  useEffect(() => {
    const q = query(collections.rooms, where("status", "==", "available"));
    return onSnapshot(q, snap => {
      const rooms = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as RoomDetails))
        .filter(r => r.occupants.length < r.capacity)
        .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
      setAvailableRooms(rooms);
    });
  }, []);

  // Watch my room requests
  useEffect(() => {
    if (!user?.id) return;
    const q = query(
      collection(db, "roomRequests"),
      where("studentId", "==", user.id),
      where("status", "==", "pending")
    );
    return onSnapshot(q, snap => {
      setPendingRequest(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() } as RoomRequest);
      setLoading(false);
    });
  }, [user?.id]);

  const requestRoom = async (room: RoomDetails) => {
    if (pendingRequest) {
      Alert.alert("Request Pending", "You already have a pending room request. Wait for admin approval.");
      return;
    }
    Alert.alert(
      "Book Room",
      `Request room ${room.roomNumber} (Block ${room.block}, Floor ${room.floor}, Capacity ${room.capacity})?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              setBooking(room.id);
              await addDoc(collection(db, "roomRequests"), {
                studentId: user?.id,
                studentName: user?.name ?? "Unknown",
                email: user?.email ?? "",
                roomId: room.id,
                roomNumber: room.roomNumber,
                block: room.block,
                status: "pending",
                createdAt: new Date().toISOString(),
              });
              Alert.alert("Request Sent!", `Your request for room ${room.roomNumber} has been sent to the admin for approval.`);
            } catch {
              Alert.alert("Error", "Failed to send request. Try again.");
            } finally {
              setBooking(null);
            }
          }
        }
      ]
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={Colors.primary} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 14 }}>
      <Text style={styles.heading}>Room Booking</Text>

      {/* Current assigned room */}
      {myRoom ? (
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>✅ My Assigned Room</Text>
          <View style={styles.row}><Text style={styles.label}>Room</Text><Text style={styles.value}>{myRoom.roomNumber}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Block</Text><Text style={styles.value}>{myRoom.block}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Floor</Text><Text style={styles.value}>{myRoom.floor}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Occupancy</Text><Text style={styles.value}>{myRoom.occupants.length}/{myRoom.capacity}</Text></View>
          <View style={[styles.badge, { backgroundColor: Colors.successLight, borderColor: Colors.success, alignSelf: "flex-start" }]}>
            <Text style={[styles.badgeText, { color: Colors.success }]}>Room Assigned</Text>
          </View>
        </Card>
      ) : pendingRequest ? (
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>⏳ Request Pending</Text>
          <Text style={styles.meta}>You requested room <Text style={{ fontWeight: "700", color: Colors.primary }}>{pendingRequest.roomNumber}</Text> (Block {pendingRequest.block}).</Text>
          <Text style={styles.meta}>Waiting for admin approval. You'll be notified once approved.</Text>
          <View style={[styles.badge, { backgroundColor: Colors.warningLight, borderColor: Colors.warning, alignSelf: "flex-start" }]}>
            <Text style={[styles.badgeText, { color: Colors.warning }]}>Pending Approval</Text>
          </View>
        </Card>
      ) : (
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>🏠 No Room Assigned</Text>
          <Text style={styles.meta}>Browse available rooms below and request one. The admin will approve your request and assign the room.</Text>
        </Card>
      )}

      {/* Available rooms list (only shown when no room and no pending) */}
      {!myRoom && (
        <>
          <Text style={styles.sectionHeading}>
            Available Rooms ({availableRooms.length})
          </Text>
          {availableRooms.length === 0 ? (
            <Card style={styles.card}>
              <Text style={styles.empty}>No available rooms at the moment. Contact the admin.</Text>
            </Card>
          ) : availableRooms.map(room => (
            <Card key={room.id} style={styles.roomCard}>
              <View style={styles.roomHeader}>
                <View>
                  <Text style={styles.roomNo}>{room.roomNumber}</Text>
                  <Text style={styles.roomMeta}>Block {room.block} · Floor {room.floor}</Text>
                </View>
                <View style={styles.capacityBadge}>
                  <Text style={styles.capacityText}>
                    {room.capacity - room.occupants.length} bed{room.capacity - room.occupants.length !== 1 ? "s" : ""} free
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.bookBtn, (!!pendingRequest || booking === room.id) && styles.bookBtnDisabled]}
                onPress={() => requestRoom(room)}
                disabled={!!pendingRequest || booking === room.id}
              >
                <Text style={styles.bookBtnText}>
                  {booking === room.id ? "Requesting…" : pendingRequest ? "Request Already Sent" : "Request This Room"}
                </Text>
              </TouchableOpacity>
            </Card>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.background, padding: 16 },
  heading:        { color: Colors.text, fontSize: 22, fontWeight: "700", marginBottom: 4 },
  sectionHeading: { color: Colors.text, fontSize: 16, fontWeight: "700" },
  card:           { gap: 8 },
  sectionTitle:   { color: Colors.text, fontSize: 15, fontWeight: "700" },
  row:            { flexDirection: "row", justifyContent: "space-between" },
  label:          { color: Colors.subtext, fontSize: 13 },
  value:          { color: Colors.text, fontSize: 13, fontWeight: "600" },
  badge:          { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  badgeText:      { fontSize: 12, fontWeight: "600" },
  meta:           { color: Colors.subtext, fontSize: 13 },
  roomCard:       { gap: 10 },
  roomHeader:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  roomNo:         { color: Colors.text, fontSize: 18, fontWeight: "700" },
  roomMeta:       { color: Colors.subtext, fontSize: 13 },
  capacityBadge:  { backgroundColor: Colors.primaryLight + "44", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  capacityText:   { color: Colors.primary, fontWeight: "600", fontSize: 13 },
  bookBtn:        { backgroundColor: Colors.primary, padding: 12, borderRadius: 10, alignItems: "center" },
  bookBtnDisabled:{ backgroundColor: Colors.muted },
  bookBtnText:    { color: "#fff", fontWeight: "700" },
  empty:          { color: Colors.muted, fontSize: 14, textAlign: "center" },
});
