import { Link } from "expo-router";
import React, { useMemo } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useComplaints } from "@/hooks/useComplaints";
import { useFees } from "@/hooks/useFees";
import { useMess } from "@/hooks/useMess";
import { useNotices } from "@/hooks/useNotices";
import { useRooms } from "@/hooks/useRooms";
import { useStudents } from "@/hooks/useStudents";
import { useHostelLeaves } from "@/hooks/useHostelLeaves";

const { width } = Dimensions.get('window');
const CURRENT_STUDENT_ID = "stu-1";

const authorities = [
  {
    role: "HEAD WARDEN",
    name: "Dr. Vikram Singh",
    title: "Chief Administrator",
    dept: "Hostel Administration",
    phone: "9814030132",
    image: "https://i.pravatar.cc/150?u=vikram",
    hasExtra: true
  },
  {
    role: "SUB HEAD WARDEN",
    name: "Mrs. Anjali Sharma",
    title: "Associate Professor",
    dept: "Student Welfare",
    phone: "9814892566",
    image: "https://i.pravatar.cc/150?u=anjali"
  },
  {
    role: "MESS INCHARGE",
    name: "Mr. Ramesh Kumar",
    title: "Culinary Manager",
    dept: "Dining Services",
    phone: "9756452877",
    image: "https://i.pravatar.cc/150?u=ramesh"
  },
  {
    role: "HOSTEL INCHARGE",
    name: "Dr. Anand Kumar Shukla",
    title: "Dean of Students",
    dept: "Campus Living",
    phone: "9888877777",
    image: "https://i.pravatar.cc/150?u=shukla"
  }
];

export default function StudentDashboardScreen() {
  const { students } = useStudents();
  const { rooms } = useRooms();
  const { fees } = useFees();
  const { complaints } = useComplaints();
  const { notices } = useNotices();
  const { menu } = useMess();
  const { leaves } = useHostelLeaves();

  const student = students.find((item) => item.id === CURRENT_STUDENT_ID) ?? students[0];
  const room = useMemo(() => rooms.find((item) => item.roomNumber === student?.roomNumber), [rooms, student?.roomNumber]);
  const studentFees = fees.filter((item) => item.studentId === CURRENT_STUDENT_ID);
  const paidFees = studentFees.filter((item) => item.status === "paid").length;
  const activeComplaints = complaints.filter((item) => item.createdBy === CURRENT_STUDENT_ID && item.status !== "resolved");
  const latestPendingLeave = leaves.find(l => l.studentId === CURRENT_STUDENT_ID && l.status === "pending");
  const latestNotices = [...notices].sort((a, b) => (a.postedAt > b.postedAt ? -1 : 1)).slice(0, 3);

  const feeCompletion = studentFees.length > 0 ? Math.round((paidFees / studentFees.length) * 100) : 0;

  // Time-based Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // Next Meal Logic
  const nextMeal = useMemo(() => {
    const hour = new Date().getHours();
    const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todayMenu = menu.find((item) => item.day === todayName) ?? menu[0];
    
    if (hour < 10) return { type: "Breakfast", icon: "sunny", items: todayMenu?.breakfast, color: "#facc15" };
    if (hour < 15) return { type: "Lunch", icon: "restaurant", items: todayMenu?.lunch, color: "#fb923c" };
    if (hour < 21) return { type: "Dinner", icon: "moon", items: todayMenu?.dinner, color: "#818cf8" };
    return { type: "Breakfast", icon: "sunny", items: menu.find(m => m.day === "Monday")?.breakfast, color: "#facc15", isNextDay: true };
  }, [menu]);

  return (
    <StudentShell title="Dashboard">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
            <Text style={styles.greetingText}>{greeting}, {student?.name?.split(' ')[0]}</Text>
          </View>
          <Pressable style={styles.profileBtn}>
             <Image source={{ uri: "https://i.pravatar.cc/150?u=stu-1" }} style={styles.avatar} />
          </Pressable>
        </View>

        {/* Top Bento Row */}
        <View style={styles.bentoRow}>
          {/* Main Status Banner */}
          <View style={[styles.bentoCard, styles.mainBanner]}>
             <View style={styles.bannerContent}>
                <Text style={styles.bannerLabel}>Current Residence</Text>
                <Text style={styles.bannerValue}>Room {room?.roomNumber ?? "N/A"}</Text>
                <View style={styles.bannerMeta}>
                  <View style={styles.metaChip}>
                    <Ionicons name="business" size={14} color="#fff" />
                    <Text style={styles.metaText}>Block {room?.block ?? "-"}</Text>
                  </View>
                  <View style={styles.metaChip}>
                    <Ionicons name="people" size={14} color="#fff" />
                    <Text style={styles.metaText}>{room?.type ?? "Single"}</Text>
                  </View>
                </View>
             </View>
             <Ionicons name="home" size={80} color="rgba(255,255,255,0.15)" style={styles.bannerBgIcon} />
          </View>

          {/* Next Meal Card */}
          <View style={[styles.bentoCard, styles.mealCard]}>
             <View style={[styles.mealIconWrap, { backgroundColor: nextMeal.color + '20' }]}>
                <Ionicons name={nextMeal.icon as any} size={20} color={nextMeal.color} />
             </View>
             <Text style={styles.mealLabel}>Next Meal: {nextMeal.type}</Text>
             <Text style={styles.mealItems} numberOfLines={2}>{nextMeal.items}</Text>
             <Link href="/student/mess" asChild>
                <Pressable style={styles.mealLink}>
                   <Text style={styles.mealLinkText}>Full Menu</Text>
                   <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
                </Pressable>
             </Link>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.bentoCard, styles.statBox]}>
             <Text style={styles.statLabel}>Fee Status</Text>
             <Text style={styles.statValue}>{feeCompletion}% Paid</Text>
             <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${feeCompletion}%` }]} />
             </View>
          </View>

          <View style={[styles.bentoCard, styles.statBox, { backgroundColor: '#f0f9ff' }]}>
             <Text style={[styles.statLabel, { color: '#0369a1' }]}>Attendance</Text>
             <Text style={[styles.statValue, { color: '#075985' }]}>92%</Text>
             <Text style={styles.statSub}>Last 30 days</Text>
          </View>

          <View style={[styles.bentoCard, styles.statBox, { backgroundColor: '#fef2f2' }]}>
             <Text style={[styles.statLabel, { color: '#b91c1c' }]}>Complaints</Text>
             <Text style={[styles.statValue, { color: '#991b1b' }]}>{activeComplaints.length}</Text>
             <Text style={styles.statSub}>Active Issues</Text>
          </View>
        </View>

        {/* Tracking Section (Dynamic Feature) */}
        {(activeComplaints.length > 0 || latestPendingLeave) && (
          <View style={styles.trackingSection}>
            <Text style={styles.sectionTitle}>Request Tracking</Text>
            <View style={[styles.bentoCard, styles.trackingCard]}>
              {latestPendingLeave ? (
                <View style={styles.trackItem}>
                  <View style={styles.trackIconWrap}>
                    <Ionicons name="airplane" size={20} color="#6366f1" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.trackTitle}>Leave Request</Text>
                    <Text style={styles.trackDesc}>{latestPendingLeave.type} Leave - {latestPendingLeave.reason}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>Pending</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.trackItem}>
                  <View style={[styles.trackIconWrap, { backgroundColor: '#fee2e2' }]}>
                    <Ionicons name="alert-circle" size={20} color="#ef4444" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.trackTitle}>Recent Complaint</Text>
                    <Text style={styles.trackDesc}>{activeComplaints[0].title}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: '#fef9c3' }]}>
                    <Text style={[styles.statusBadgeText, { color: '#854d0e' }]}>{activeComplaints[0].status}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Notices Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Announcements</Text>
            <Link href="/student/notices" asChild>
               <Pressable><Text style={styles.seeAll}>See all</Text></Pressable>
            </Link>
          </View>
          <View style={styles.noticeContainer}>
            {latestNotices.map((notice, idx) => (
              <View key={notice.id} style={[styles.noticeItem, idx === latestNotices.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.noticeDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.noticeText} numberOfLines={1}>{notice.title}</Text>
                  <Text style={styles.noticeTime}>{new Date(notice.postedAt).toLocaleDateString()}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.muted} />
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
             <ActionItem icon="add-circle" label="New Complaint" color="#ef4444" href="/student/complaints/new" />
             <ActionItem icon="airplane" label="Leave Request" color="#6366f1" href="/student/hostel-leave/new" />
             <ActionItem icon="wallet" label="Pay Fees" color="#10b981" href="/student/fees" />
             <ActionItem icon="chatbubble-ellipses" label="Help Desk" color="#0ea5e9" href="/student/chatbot" />
             <ActionItem icon="bed" label="My Room" color="#f59e0b" href="/student/room" />
             <ActionItem icon="person" label="Profile" color="#8b5cf6" href="/student/profile" />
          </View>
        </View>

        {/* Authorities Section (Image Style) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Know Your Authorities</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.authScroll}>
            {authorities.map((auth) => (
              <View key={auth.role} style={styles.authCard}>
                <View style={styles.authAvatarWrap}>
                  <Image source={{ uri: auth.image }} style={styles.authAvatar} />
                </View>
                
                <View style={styles.authRoleHeader}>
                  <Ionicons name="bookmark-outline" size={14} color="#64748b" />
                  <Text style={styles.authRoleText}>{auth.role}</Text>
                </View>

                <View style={styles.authInfo}>
                  <Text style={styles.authNameText}>{auth.name}</Text>
                  <Text style={styles.authTitleText}>{auth.title}</Text>
                  <Text style={styles.authDeptText}>{auth.dept}</Text>
                  
                  <View style={styles.authContactRow}>
                    <Ionicons name="mail-outline" size={14} color="#64748b" />
                    <Text style={styles.authContactText}>NA</Text>
                  </View>
                  <View style={styles.authContactRow}>
                    <Ionicons name="call-outline" size={14} color="#64748b" />
                    <Text style={styles.authContactText}>{auth.phone}</Text>
                  </View>

                  <Pressable style={styles.bookBtn}>
                    <Text style={styles.bookBtnText}>Book Appointment</Text>
                  </Pressable>

                  {auth.hasExtra && (
                    <View style={styles.extraBox}>
                      <Text style={styles.extraText}>In case of any query/issue related to 'Hostel Life',</Text>
                      <Pressable style={styles.clickBtn}>
                        <Text style={styles.clickBtnText}>Click Here</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </StudentShell>
  );
}

const ActionItem = ({ icon, label, color, href }: any) => (
  <Link href={href} asChild>
    <Pressable style={styles.actionBtn}>
       <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={24} color={color} />
       </View>
       <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  </Link>
);

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    paddingBottom: 40,
    gap: 24,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  dateText: {
    fontSize: 13,
    color: Colors.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e293b',
    marginTop: 4,
  },
  profileBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },

  /* Bento Layout Components */
  bentoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  bentoCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  mainBanner: {
    flex: 1.5,
    backgroundColor: Colors.primary,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  bannerContent: {
    gap: 4,
    zIndex: 1,
  },
  bannerLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bannerValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
  },
  bannerMeta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  bannerBgIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },

  mealCard: {
    flex: 1,
    gap: 8,
  },
  mealIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.muted,
  },
  mealItems: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
    lineHeight: 20,
  },
  mealLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 'auto',
  },
  mealLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },

  /* Stats Grid */
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.muted,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
  },
  statSub: {
    fontSize: 10,
    color: Colors.muted,
    fontWeight: '600',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    marginTop: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },

  /* Tracking Section */
  trackingSection: {
    gap: 12,
  },
  trackingCard: {
    padding: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  trackIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
  },
  trackDesc: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4338ca',
  },

  /* Authorities Section */
  authScroll: {
    gap: 16,
    paddingRight: 20,
    paddingBottom: 10,
  },
  authCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderTopWidth: 4,
    borderTopColor: '#f97316',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  authAvatarWrap: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  authAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  authRoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  authRoleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.5,
  },
  authInfo: {
    padding: 16,
    gap: 4,
  },
  authNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  authTitleText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  authDeptText: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 8,
  },
  authContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  authContactText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  bookBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  extraBox: {
    marginTop: 12,
    alignItems: 'center',
    gap: 8,
  },
  extraText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  clickBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  clickBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Common Sections */
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  noticeContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  noticeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  noticeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  noticeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  noticeTime: {
    fontSize: 11,
    color: Colors.muted,
    marginTop: 2,
  },

  /* Action Grid */
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionBtn: {
    width: (width - 64) / 3,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center',
  },
});