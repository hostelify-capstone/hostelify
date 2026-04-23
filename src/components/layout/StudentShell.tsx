import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/colors";
import { StudentSidebar } from "@/components/layout/StudentSidebar";
import { StudentTopBar } from "@/components/layout/StudentTopBar";

interface StudentShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showBottomNav?: boolean;
}

export const StudentShell = ({
  title,
  subtitle: _subtitle,
  children,
  showBottomNav = true,
}: StudentShellProps) => {
  return (
    <View style={styles.wrapper}>
      {showBottomNav ? <StudentSidebar /> : null}
      <View style={styles.main}>
        <StudentTopBar title={title} />
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background,
    flexDirection: "row",
  },
  main: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
});
