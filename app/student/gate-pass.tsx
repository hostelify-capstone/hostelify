import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { collections } from "@/services/firebase/firestore";
import { addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";

type GatePass = {
  id: string;
  studentId: string;
  studentName: string;
  destination: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

const STATUS_COLORS = {
  pending:  Colors.warning,
  approved: Colors.success,
  rejected: Colors.danger,
};

export default function GatePassScreen() {
  const { user } = useAuth();
  const [passes, setPasses] = useState<GatePass[]>([]);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState("");
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const q = query(collections.gatePasses, where("studentId", "==", user.id));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as GatePass));
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPasses(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user?.id]);

  const submit = async () => {
    if (!destination.trim() || !reason.trim() || !fromDate || !toDate) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    try {
      setSubmitting(true);
      await addDoc(collections.gatePasses, {
        studentId: user?.id,
        studentName: user?.name ?? "Unknown",
        roomNumber: user?.roomNumber ?? "",
        destination: destination.trim(),
        reason: reason.trim(),
        fromDate,
        toDate,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      setDestination(""); setReason(""); setFromDate(""); setToDate("");
      Alert.alert("Submitted", "Your gate pass request has been submitted for approval.");
    } catch { Alert.alert("Error", "Failed to submit. Try again."); }
    finally { setSubmitting(false); }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 14 }}>
      <Text style={styles.heading}>Gate Pass</Text>

      {/* New request form */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>🚪 Request Gate Pass</Text>
        <TextInput style={styles.input} placeholder="Destination" placeholderTextColor={Colors.muted} value={destination} onChangeText={setDestination} />
        <TextInput style={styles.input} placeholder="Reason for leaving" placeholderTextColor={Colors.muted} value={reason} onChangeText={setReason} multiline />
        <View style={styles.dateRow}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="From (YYYY-MM-DD)" placeholderTextColor={Colors.muted} value={fromDate} onChangeText={setFromDate} />
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="To (YYYY-MM-DD)" placeholderTextColor={Colors.muted} value={toDate} onChangeText={setToDate} />
        </View>
        <TouchableOpacity style={[styles.btn, submitting && { opacity: 0.6 }]} onPress={submit} disabled={submitting}>
          <Text style={styles.btnText}>{submitting ? "Submitting…" : "Submit Request"}</Text>
        </TouchableOpacity>
      </Card>

      {/* My past requests */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>📋 My Requests</Text>
        {loading ? <ActivityIndicator color={Colors.primary} /> :
         passes.length === 0 ? <Text style={styles.empty}>No gate pass requests yet.</Text> :
         passes.map(p => (
          <View key={p.id} style={styles.passItem}>
            <View style={styles.row}>
              <Text style={styles.dest}>{p.destination}</Text>
              <View style={[styles.badge, { backgroundColor: STATUS_COLORS[p.status] + "22", borderColor: STATUS_COLORS[p.status] }]}>
                <Text style={[styles.badgeText, { color: STATUS_COLORS[p.status] }]}>{p.status}</Text>
              </View>
            </View>
            <Text style={styles.meta}>{p.fromDate} → {p.toDate}</Text>
            <Text style={styles.meta}>{p.reason}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.background, padding: 16 },
  heading:      { color: Colors.text, fontSize: 22, fontWeight: "700", marginBottom: 4 },
  card:         { gap: 10 },
  sectionTitle: { color: Colors.text, fontSize: 15, fontWeight: "700" },
  input:        { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 10, color: Colors.text },
  dateRow:      { flexDirection: "row", gap: 8 },
  btn:          { backgroundColor: Colors.primary, padding: 12, borderRadius: 10, alignItems: "center" },
  btnText:      { color: "#fff", fontWeight: "700" },
  passItem:     { paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.border, gap: 3 },
  row:          { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dest:         { color: Colors.text, fontWeight: "600", fontSize: 14 },
  meta:         { color: Colors.subtext, fontSize: 12 },
  badge:        { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, borderWidth: 1 },
  badgeText:    { fontSize: 11, fontWeight: "600", textTransform: "capitalize" },
  empty:        { color: Colors.muted, fontSize: 14 },
});