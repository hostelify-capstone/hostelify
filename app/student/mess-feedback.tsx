import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { collections } from "@/services/firebase/firestore";
import type { MessFeedback, MessMenu } from "@/types";
import { addDoc, onSnapshot, orderBy, query } from "firebase/firestore";

const MEALS = ["breakfast", "lunch", "snacks", "dinner"] as const;
type Meal = typeof MEALS[number];

export default function MessFeedbackScreen() {
  const { user } = useAuth();
  const [menu, setMenu] = useState<MessMenu[]>([]);
  const [feedbacks, setFeedbacks] = useState<MessFeedback[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [meal, setMeal] = useState<Meal>("lunch");
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayMenu = menu.find(m => m.day === today);

  useEffect(() => {
    const unsub1 = onSnapshot(collections.messMenu, snap => {
      setMenu(snap.docs.map(d => ({ id: d.id, ...d.data() } as MessMenu)));
    });
    const q = query(collections.messFeedback, orderBy("date", "desc"));
    const unsub2 = onSnapshot(q, snap => {
      setFeedbacks(snap.docs.map(d => ({ id: d.id, ...d.data() } as MessFeedback)));
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  const submit = async () => {
    if (!comment.trim()) { Alert.alert("Please add a comment."); return; }
    try {
      setSubmitting(true);
      await addDoc(collections.messFeedback, {
        studentName: user?.name ?? "Unknown",
        rating,
        comment: comment.trim(),
        meal,
        date: new Date().toISOString().split("T")[0],
      });
      setComment(""); setRating(5);
      Alert.alert("Thanks!", "Your feedback has been submitted.");
    } catch { Alert.alert("Error", "Failed to submit feedback."); }
    finally { setSubmitting(false); }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 14 }}>
      <Text style={styles.heading}>Mess Feedback</Text>

      {/* Today's menu */}
      {todayMenu && (
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>📋 Today's Menu ({today})</Text>
          {(["breakfast","lunch","snacks","dinner"] as Meal[]).map(m => (
            <View key={m} style={styles.menuRow}>
              <Text style={styles.mealLabel}>{m.charAt(0).toUpperCase()+m.slice(1)}</Text>
              <Text style={styles.mealValue}>{(todayMenu as any)[m]}</Text>
            </View>
          ))}
        </Card>
      )}

      {/* Submit feedback */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>⭐ Submit Feedback</Text>
        <Text style={styles.label}>Meal</Text>
        <View style={styles.mealTabs}>
          {MEALS.map(m => (
            <TouchableOpacity key={m} style={[styles.mealTab, meal===m && styles.mealTabActive]} onPress={() => setMeal(m)}>
              <Text style={[styles.mealTabText, meal===m && styles.mealTabTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Rating</Text>
        <View style={styles.stars}>
          {[1,2,3,4,5].map(s => (
            <TouchableOpacity key={s} onPress={() => setRating(s)}>
              <Text style={[styles.star, s <= rating && styles.starActive]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Comment</Text>
        <TextInput style={styles.input} placeholder="Share your experience..." placeholderTextColor={Colors.muted}
          value={comment} onChangeText={setComment} multiline numberOfLines={3} />
        <TouchableOpacity style={[styles.btn, submitting && { opacity: 0.6 }]} onPress={submit} disabled={submitting}>
          <Text style={styles.btnText}>{submitting ? "Submitting…" : "Submit Feedback"}</Text>
        </TouchableOpacity>
      </Card>

      {/* Recent feedback */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>💬 Recent Feedback</Text>
        {feedbacks.slice(0, 5).map(f => (
          <View key={f.id} style={styles.feedbackItem}>
            <View style={styles.row}>
              <Text style={styles.fbName}>{f.studentName}</Text>
              <Text style={styles.fbMeta}>{f.meal} · {"★".repeat(f.rating)}</Text>
            </View>
            <Text style={styles.fbComment}>{f.comment}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: Colors.background, padding: 16 },
  heading:          { color: Colors.text, fontSize: 22, fontWeight: "700", marginBottom: 4 },
  card:             { gap: 10 },
  sectionTitle:     { color: Colors.text, fontSize: 15, fontWeight: "700" },
  label:            { color: Colors.subtext, fontSize: 13 },
  menuRow:          { flexDirection: "row", gap: 8 },
  mealLabel:        { color: Colors.primary, fontSize: 13, fontWeight: "600", width: 80 },
  mealValue:        { color: Colors.text, fontSize: 13, flex: 1 },
  mealTabs:         { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  mealTab:          { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  mealTabActive:    { backgroundColor: Colors.primary, borderColor: Colors.primary },
  mealTabText:      { color: Colors.subtext, fontSize: 13, textTransform: "capitalize" },
  mealTabTextActive:{ color: "#fff" },
  stars:            { flexDirection: "row", gap: 8 },
  star:             { fontSize: 28, color: Colors.border },
  starActive:       { color: Colors.warning },
  input:            { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 10, color: Colors.text, minHeight: 70, textAlignVertical: "top" },
  btn:              { backgroundColor: Colors.primary, padding: 12, borderRadius: 10, alignItems: "center" },
  btnText:          { color: "#fff", fontWeight: "700" },
  feedbackItem:     { paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  row:              { flexDirection: "row", justifyContent: "space-between" },
  fbName:           { color: Colors.text, fontWeight: "600", fontSize: 13 },
  fbMeta:           { color: Colors.warning, fontSize: 13 },
  fbComment:        { color: Colors.subtext, fontSize: 13 },
});