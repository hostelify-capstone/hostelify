import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  iconBg: string;
  change?: number;
}

export const StatCard = ({ label, value, icon, iconBg, change }: StatCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
          {change !== undefined && (
            <View style={styles.changeRow}>
              <Text style={[styles.changeText, { color: change >= 0 ? Colors.success : Colors.danger }]}>
                {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
              </Text>
              <Text style={styles.changePeriod}>vs last month</Text>
            </View>
          )}
        </View>
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#6366f1",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
    flex: 1,
    minWidth: 200,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  label: {
    color: Colors.subtext,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  value: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  changePeriod: {
    fontSize: 11,
    color: Colors.muted,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 22,
  },
});
