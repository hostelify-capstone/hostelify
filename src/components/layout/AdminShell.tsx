import React from "react";
import { StyleSheet, View } from "react-native";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";
import { Colors } from "@/constants/colors";

interface AdminShellProps {
  title: string;
  children: React.ReactNode;
}

export const AdminShell = ({ title, children }: AdminShellProps) => {
  return (
    <View style={styles.wrapper}>
      <AdminSidebar />
      <View style={styles.main}>
        <AdminTopBar title={title} />
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.background,
  },
  main: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
});
