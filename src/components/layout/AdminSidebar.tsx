import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Colors } from "@/constants/colors";

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "📊", route: "/admin/dashboard" },
  { label: "Students", icon: "👥", route: "/admin/students" },
  { label: "Rooms", icon: "🏠", route: "/admin/rooms" },
  { label: "Complaints", icon: "📋", route: "/admin/complaints" },
  { label: "Fees", icon: "💰", route: "/admin/fees" },
  { label: "Notices", icon: "📢", route: "/admin/notices" },
  { label: "Mess", icon: "🍽️", route: "/admin/mess" },
  { label: "Hostel Leave", icon: "🚪", route: "/admin/hostel-leave" },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const { signOutUser } = await import("@/services/firebase/auth");
    await signOutUser();
    router.replace("/auth/login");
  };

  return (
    <View style={styles.sidebar}>
      {/* Logo */}
      <View style={styles.logoWrap}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoEmoji}>🏨</Text>
        </View>
        <Text style={styles.logoText}>Hostelify</Text>
        <Text style={styles.logoSub}>Admin Portal</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Navigation */}
      <ScrollView style={styles.nav} showsVerticalScrollIndicator={false}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.route ||
            (item.route !== "/admin/dashboard" && pathname.startsWith(item.route));
          return (
            <Pressable
              key={item.route}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => router.push(item.route as any)}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.divider} />
      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.navIcon}>🚪</Text>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: Colors.sidebarBg,
    paddingVertical: 20,
    paddingHorizontal: 14,
  },
  logoWrap: {
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.sidebarActive,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoEmoji: {
    fontSize: 24,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  logoSub: {
    color: Colors.sidebarText,
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.sidebarHover,
    marginVertical: 16,
  },
  nav: {
    flex: 1,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 4,
    gap: 12,
    position: "relative",
  },
  navItemActive: {
    backgroundColor: Colors.sidebarActive,
  },
  navIcon: {
    fontSize: 18,
    width: 24,
    textAlign: "center",
  },
  navLabel: {
    color: Colors.sidebarText,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  navLabelActive: {
    color: "#ffffff",
  },
  activeIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#ffffff",
    position: "absolute",
    right: 0,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    marginTop: 4,
  },
  logoutText: {
    color: Colors.sidebarText,
    fontSize: 14,
    fontWeight: "600",
  },
});
