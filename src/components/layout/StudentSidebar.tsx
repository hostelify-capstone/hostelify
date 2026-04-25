import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

interface StudentNavItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const NAV_ITEMS: StudentNavItem[] = [
  { label: "Dashboard", icon: "grid-outline", route: "/student/dashboard" },
  { label: "Room", icon: "home-outline", route: "/student/room" },
  { label: "Fees", icon: "wallet-outline", route: "/student/fees" },
  { label: "Complaints", icon: "clipboard-outline", route: "/student/complaints" },
  { label: "Notices", icon: "megaphone-outline", route: "/student/notices" },
  { label: "Mess", icon: "restaurant-outline", route: "/student/mess" },
  { label: "Hostel Leave", icon: "exit-outline", route: "/student/hostel-leave" },
  { label: "Profile", icon: "person-outline", route: "/student/profile" },
  { label: "AI Chat", icon: "chatbubble-ellipses-outline", route: "/student/chatbot" },
];

export const StudentSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.sidebar}>
      <View style={styles.logoWrap}>
        <View style={styles.logoIcon}>
          <Ionicons name="business-outline" size={24} color="#ffffff" />
        </View>
        <Text style={styles.logoText}>Hostelify</Text>
        <Text style={styles.logoSub}>Student Portal</Text>
      </View>

      <View style={styles.divider} />

      <ScrollView style={styles.nav} showsVerticalScrollIndicator={false}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          const activeIcon = item.icon.replace("-outline", "") as keyof typeof Ionicons.glyphMap;
          return (
            <Pressable
              key={item.route}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.navIconWrap}>
                <Ionicons
                  name={isActive ? activeIcon : item.icon}
                  size={20}
                  color={isActive ? "#ffffff" : Colors.sidebarText}
                />
              </View>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
              {isActive && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.divider} />
      <Pressable style={styles.logoutBtn} onPress={() => router.replace("/auth/login")}> 
        <View style={styles.navIconWrap}>
          <Ionicons name="log-out-outline" size={20} color={Colors.sidebarText} />
        </View>
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
  navIconWrap: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
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
