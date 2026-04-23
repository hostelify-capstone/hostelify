import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentShell } from "@/components/layout/StudentShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useMess } from "@/hooks/useMess";

export default function StudentMessScreen() {
  const { menu } = useMess();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const todayMenu = useMemo(
    () => menu.find((item) => item.day === todayName) ?? menu[0],
    [menu, todayName]
  );

  return (
    <StudentShell title="Mess Module" subtitle="Menu, ratings, and meal feedback">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card style={styles.todayCard}>
          <Text style={styles.sectionTitle}>Today's Menu - {todayMenu?.day}</Text>
          <MealRow label="Breakfast" value={todayMenu?.breakfast ?? "-"} />
          <MealRow label="Lunch" value={todayMenu?.lunch ?? "-"} />
          <MealRow label="Snacks" value={todayMenu?.snacks ?? "-"} />
          <MealRow label="Dinner" value={todayMenu?.dinner ?? "-"} />
        </Card>

        <Card style={styles.weekCard}>
          <Text style={styles.sectionTitle}>Weekly Menu</Text>
          {menu.map((item) => (
            <View key={item.id} style={styles.weekItem}>
              <Text style={styles.weekDay}>{item.day}</Text>
              <Text style={styles.weekSummary}>{item.lunch}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.feedbackCard}>
          <Text style={styles.sectionTitle}>Rate Today's Food</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={30}
                  color={star <= rating ? Colors.warning : Colors.border}
                />
              </Pressable>
            ))}
          </View>
          <TextInput
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Share your feedback"
            placeholderTextColor={Colors.subtext}
            multiline
            numberOfLines={4}
            style={styles.feedbackInput}
          />
          <Button
            title="Submit Feedback"
            onPress={() => {
              Alert.alert("Thanks", "Your mess feedback has been submitted.");
              setRating(0);
              setFeedback("");
            }}
          />
        </Card>
      </ScrollView>
    </StudentShell>
  );
}

const MealRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.mealRow}>
    <Text style={styles.mealLabel}>{label}</Text>
    <Text style={styles.mealValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  scroll: {
    gap: 14,
    paddingBottom: 24,
  },
  todayCard: {
    gap: 10,
    padding: 16,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  mealRow: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  mealLabel: {
    color: Colors.subtext,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  mealValue: {
    color: Colors.text,
    fontSize: 14,
  },
  weekCard: {
    gap: 10,
    padding: 16,
  },
  weekItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
    gap: 10,
  },
  weekDay: {
    color: Colors.text,
    fontWeight: "700",
    fontSize: 13,
    width: 90,
  },
  weekSummary: {
    color: Colors.subtext,
    fontSize: 13,
    flex: 1,
    textAlign: "right",
  },
  feedbackCard: {
    gap: 12,
    padding: 16,
  },
  starRow: {
    flexDirection: "row",
    gap: 8,
  },
  star: {},
  starActive: {},
  feedbackInput: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.card,
    padding: 12,
    color: Colors.text,
    textAlignVertical: "top",
  },
});
