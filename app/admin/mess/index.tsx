import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AdminShell } from "@/components/layout/AdminShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Colors } from "@/constants/colors";
import { useMess } from "@/hooks/useMess";
import type { MessMenu } from "@/types";

const MEAL_ICONS: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  snacks: "🍿",
  dinner: "🌙",
};

export default function AdminMessScreen() {
  const { menu, feedback, updateMenuItem, feedbackStats } = useMess();
  const [editMenu, setEditMenu] = useState<MessMenu | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Form
  const [formBreakfast, setFormBreakfast] = useState("");
  const [formLunch, setFormLunch] = useState("");
  const [formSnacks, setFormSnacks] = useState("");
  const [formDinner, setFormDinner] = useState("");

  const openEditModal = (item: MessMenu) => {
    setEditMenu(item);
    setFormBreakfast(item.breakfast);
    setFormLunch(item.lunch);
    setFormSnacks(item.snacks);
    setFormDinner(item.dinner);
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (!editMenu) return;
    updateMenuItem(editMenu.id, {
      breakfast: formBreakfast.trim(),
      lunch: formLunch.trim(),
      snacks: formSnacks.trim(),
      dinner: formDinner.trim(),
    });
    setModalVisible(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (i < rating ? "★" : "☆")).join("");
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return Colors.success;
    if (rating >= 3) return Colors.warning;
    return Colors.danger;
  };

  return (
    <AdminShell title="Mess Management">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Feedback Stats */}
        <View style={styles.statsRow}>
          <StatCard
            label="Average Rating"
            value={`${feedbackStats.avgRating}/5`}
            icon="⭐"
            iconBg={Colors.warningLight}
          />
          <StatCard
            label="Total Feedback"
            value={feedbackStats.totalFeedback}
            icon="💬"
            iconBg={Colors.primaryLight}
          />
          <StatCard
            label="Best Meal"
            value={getBestMeal(feedbackStats.mealAverages)}
            icon="🏆"
            iconBg={Colors.successLight}
          />
          <StatCard
            label="Needs Improvement"
            value={getWorstMeal(feedbackStats.mealAverages)}
            icon="📉"
            iconBg={Colors.dangerLight}
          />
        </View>

        {/* Feedback Analytics */}
        <View style={styles.analyticsRow}>
          {/* Rating Distribution */}
          <Card style={styles.analyticsCard}>
            <Text style={styles.analyticsTitle}>Rating Distribution</Text>
            <Text style={styles.analyticsSubtitle}>Based on all feedback</Text>
            <View style={styles.ratingBars}>
              {feedbackStats.ratingDistribution.reverse().map((item) => (
                <View key={item.rating} style={styles.ratingBarRow}>
                  <Text style={styles.ratingLabel}>{item.rating} ★</Text>
                  <View style={styles.ratingTrack}>
                    <View
                      style={[
                        styles.ratingFill,
                        {
                          width: `${feedbackStats.totalFeedback > 0 ? (item.count / feedbackStats.totalFeedback) * 100 : 0}%`,
                          backgroundColor: getRatingColor(item.rating),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.ratingCount}>{item.count}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Meal-wise Average */}
          <Card style={styles.analyticsCard}>
            <Text style={styles.analyticsTitle}>Meal-wise Ratings</Text>
            <Text style={styles.analyticsSubtitle}>Average rating per meal</Text>
            <View style={styles.mealRatings}>
              {Object.entries(feedbackStats.mealAverages).map(([meal, avg]) => (
                <View key={meal} style={styles.mealRatingRow}>
                  <Text style={styles.mealIcon}>{MEAL_ICONS[meal] ?? "🍛"}</Text>
                  <Text style={styles.mealName}>
                    {meal.charAt(0).toUpperCase() + meal.slice(1)}
                  </Text>
                  <View style={styles.mealScoreWrap}>
                    <Text style={[styles.mealScore, { color: getRatingColor(avg) }]}>
                      {avg}
                    </Text>
                    <Text style={styles.mealStars}>{renderStars(Math.round(avg))}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Weekly Menu */}
        <SectionHeader
          title="Weekly Menu"
          subtitle="Click edit to update any day's menu"
        />
        <View style={styles.menuGrid}>
          {menu.map((day) => (
            <Card key={day.id} style={styles.menuCard}>
              <View style={styles.menuCardHeader}>
                <Text style={styles.dayName}>{day.day}</Text>
                <Pressable style={styles.dayEditBtn} onPress={() => openEditModal(day)}>
                  <Text style={styles.dayEditText}>✏️ Edit</Text>
                </Pressable>
              </View>
              <MealRow icon="🌅" label="Breakfast" value={day.breakfast} />
              <MealRow icon="☀️" label="Lunch" value={day.lunch} />
              <MealRow icon="🍿" label="Snacks" value={day.snacks} />
              <MealRow icon="🌙" label="Dinner" value={day.dinner} />
            </Card>
          ))}
        </View>

        {/* Recent Feedback */}
        <SectionHeader title="Recent Feedback" subtitle="Latest student reviews" />
        <View style={styles.feedbackList}>
          {feedback.slice(0, 8).map((fb) => (
            <Card key={fb.id} style={styles.feedbackCard}>
              <View style={styles.feedbackHeader}>
                <View style={styles.feedbackUser}>
                  <View style={styles.feedbackAvatar}>
                    <Text style={styles.feedbackAvatarText}>
                      {fb.studentName.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.feedbackName}>{fb.studentName}</Text>
                    <Text style={styles.feedbackMeta}>
                      {fb.meal.charAt(0).toUpperCase() + fb.meal.slice(1)} • {fb.date}
                    </Text>
                  </View>
                </View>
                <View style={styles.feedbackRating}>
                  <Text style={[styles.feedbackStars, { color: getRatingColor(fb.rating) }]}>
                    {renderStars(fb.rating)}
                  </Text>
                  <Text style={[styles.feedbackScore, { color: getRatingColor(fb.rating) }]}>
                    {fb.rating}/5
                  </Text>
                </View>
              </View>
              <Text style={styles.feedbackComment}>{fb.comment}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Edit Menu Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit Menu — {editMenu?.day}
            </Text>
            <Input
              label="🌅 Breakfast"
              value={formBreakfast}
              onChangeText={setFormBreakfast}
              placeholder="Breakfast items"
            />
            <Input
              label="☀️ Lunch"
              value={formLunch}
              onChangeText={setFormLunch}
              placeholder="Lunch items"
            />
            <Input
              label="🍿 Snacks"
              value={formSnacks}
              onChangeText={setFormSnacks}
              placeholder="Snacks items"
            />
            <Input
              label="🌙 Dinner"
              value={formDinner}
              onChangeText={setFormDinner}
              placeholder="Dinner items"
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} variant="secondary" />
              <Button title="Update Menu" onPress={handleSubmit} />
            </View>
          </View>
        </View>
      </Modal>
    </AdminShell>
  );
}

/* ── Sub Components ── */

const MealRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.mealRow}>
    <Text style={styles.mealRowIcon}>{icon}</Text>
    <View style={styles.mealRowContent}>
      <Text style={styles.mealRowLabel}>{label}</Text>
      <Text style={styles.mealRowValue}>{value}</Text>
    </View>
  </View>
);

/* ── Helpers ── */

function getBestMeal(averages: Record<string, number>): string {
  let best = "";
  let max = 0;
  for (const [meal, avg] of Object.entries(averages)) {
    if (avg > max) {
      max = avg;
      best = meal;
    }
  }
  return best ? best.charAt(0).toUpperCase() + best.slice(1) : "N/A";
}

function getWorstMeal(averages: Record<string, number>): string {
  let worst = "";
  let min = 6;
  for (const [meal, avg] of Object.entries(averages)) {
    if (avg < min) {
      min = avg;
      worst = meal;
    }
  }
  return worst ? worst.charAt(0).toUpperCase() + worst.slice(1) : "N/A";
}

/* ── Styles ── */

const styles = StyleSheet.create({
  scroll: { gap: 20, paddingBottom: 24 },
  statsRow: { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  analyticsRow: { flexDirection: "row", gap: 16, flexWrap: "wrap" },

  // Analytics Cards
  analyticsCard: {
    flex: 1,
    minWidth: 340,
    padding: 20,
    gap: 4,
  },
  analyticsTitle: { fontSize: 17, fontWeight: "700", color: Colors.text },
  analyticsSubtitle: { fontSize: 13, color: Colors.subtext, marginBottom: 16 },

  // Rating Distribution Bars
  ratingBars: { gap: 10 },
  ratingBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ratingLabel: {
    width: 36,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "right",
  },
  ratingTrack: {
    flex: 1,
    height: 20,
    backgroundColor: Colors.border,
    borderRadius: 6,
    overflow: "hidden",
  },
  ratingFill: {
    height: "100%",
    borderRadius: 6,
    minWidth: 4,
  },
  ratingCount: {
    width: 20,
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
  },

  // Meal-wise Ratings
  mealRatings: { gap: 14 },
  mealRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  mealIcon: { fontSize: 22, width: 30, textAlign: "center" },
  mealName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  mealScoreWrap: {
    alignItems: "flex-end",
    gap: 2,
  },
  mealScore: {
    fontSize: 18,
    fontWeight: "800",
  },
  mealStars: {
    fontSize: 13,
    color: Colors.warning,
  },

  // Menu Grid
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  menuCard: {
    width: 320,
    padding: 16,
    gap: 10,
  },
  menuCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  dayName: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primary,
  },
  dayEditBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayEditText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },

  // Meal Rows
  mealRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  mealRowIcon: { fontSize: 16, width: 24, marginTop: 1 },
  mealRowContent: { flex: 1, gap: 1 },
  mealRowLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.subtext,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mealRowValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: "500",
  },

  // Feedback List
  feedbackList: { gap: 12 },
  feedbackCard: { padding: 16, gap: 10 },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedbackUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  feedbackAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackAvatarText: {
    color: Colors.primaryDark,
    fontSize: 15,
    fontWeight: "700",
  },
  feedbackName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  feedbackMeta: {
    fontSize: 12,
    color: Colors.subtext,
  },
  feedbackRating: {
    alignItems: "flex-end",
    gap: 2,
  },
  feedbackStars: {
    fontSize: 16,
  },
  feedbackScore: {
    fontSize: 12,
    fontWeight: "700",
  },
  feedbackComment: {
    fontSize: 14,
    color: Colors.subtext,
    lineHeight: 20,
    fontStyle: "italic",
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 500,
    gap: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
});
