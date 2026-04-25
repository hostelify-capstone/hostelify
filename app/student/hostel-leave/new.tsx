import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentShell } from "@/components/layout/StudentShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useHostelLeaves } from "@/hooks/useHostelLeaves";
import type { LeaveType, VisitPlace } from "@/types";
import { CalendarModal, TimePickerModal } from "@/components/modals/CustomDateTimePicker";

const CURRENT_STUDENT_ID = "stu-1";

const LEAVE_TYPES: { value: LeaveType; label: string; icon: keyof typeof Ionicons.glyphMap; desc: string }[] = [
  { value: "day", label: "Day Leave", icon: "sunny-outline", desc: "Leave during daytime hours" },
  { value: "night", label: "Night Leave", icon: "moon-outline", desc: "Overnight stay outside hostel" },
  { value: "vacation", label: "Vacation Leave", icon: "airplane-outline", desc: "Extended leave for multiple days" },
];

const VISIT_PLACES: VisitPlace[] = [
  "Home",
  "Local Guardian",
  "Personal Grooming",
  "Medical Checkup",
  "Academic Purposes",
  "Local Visit",
  "Out Station Visit",
  "Coaching",
  "Placement",
  "Other",
];

export default function NewHostelLeaveScreen() {
  const { addLeave } = useHostelLeaves();
  const [leaveType, setLeaveType] = useState<LeaveType>("day");
  const [visitPlace, setVisitPlace] = useState<VisitPlace | "">("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [showVisitDropdown, setShowVisitDropdown] = useState(false);

  // Modal states
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activePicker, setActivePicker] = useState<"start" | "end" | null>(null);
  const [tempDate, setTempDate] = useState("");

  // Animation for the walking boy
  const walkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      walkAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(walkAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(walkAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    startAnimation();
  }, []);

  const translateX = walkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 300],
  });

  const handleDateSelect = (date: string) => {
    setTempDate(date);
    setShowCalendar(false);
    setShowTimePicker(true);
  };

  const handleTimeSelect = (time: string) => {
    const combined = `${tempDate} ${time}`;
    if (activePicker === "start") {
      setStartDate(combined);
    } else {
      setEndDate(combined);
    }
    setShowTimePicker(false);
    setActivePicker(null);
  };

  const handleSubmit = () => {
    if (!reason.trim()) {
      Alert.alert("Missing Field", "Please provide a reason for leaving.");
      return;
    }
    if (!visitPlace) {
      Alert.alert("Missing Field", "Please select a visit place.");
      return;
    }
    if (!startDate.trim() || !endDate.trim()) {
      Alert.alert("Missing Field", "Please provide start and end date/time.");
      return;
    }
    if (!mobileNo.trim()) {
      Alert.alert("Missing Field", "Please provide your mobile number.");
      return;
    }

    const parseDateTime = (str: string) => {
      const parts = str.split(' ');
      if (parts.length < 3) return new Date();
      const [datePart, timePart, ampm] = parts;
      let [hours, minutes] = timePart.split(':').map(Number);
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      return new Date(`${datePart}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
    };

    const start = parseDateTime(startDate);
    const startHour = start.getHours();

    if (leaveType === "day") {
      if (startHour < 0 || startHour >= 19) {
        Alert.alert("Invalid Timing", "Day leave must be between 12 AM and 7 PM.");
        return;
      }
    } else if (leaveType === "night") {
      if (startHour < 19 && startHour !== 0) {
        Alert.alert("Invalid Timing", "Night leave must be between 7 PM and 12 AM.");
        return;
      }
    }

    addLeave({
      studentId: CURRENT_STUDENT_ID,
      studentName: "Rahul Sharma",
      roomNumber: "A-201",
      leaveType,
      visitPlace: visitPlace as VisitPlace,
      reason: reason.trim(),
      startDate: start.toISOString(),
      endDate: parseDateTime(endDate).toISOString(),
      mobileNo: mobileNo.trim(),
    });

    Alert.alert(
      "Successfully Submitted",
      "Your hostel leave application has been submitted and is now pending approval.",
      [
        {
          text: "OK",
          onPress: () => router.replace("/student/hostel-leave"),
        },
      ]
    );
  };

  const handleReset = () => {
    setLeaveType("day");
    setVisitPlace("");
    setReason("");
    setStartDate("");
    setEndDate("");
    setMobileNo("");
  };

  return (
    <StudentShell title="Apply Leave" subtitle="Submit your hostel leave request" showBottomNav={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Leave Application</Text>
            </View>
          </View>

          <View style={styles.animationContainer}>
            <Animated.View style={{ transform: [{ translateX }] }}>
              <Image 
                source={require("@/assets/images/boy_leave.png")} 
                style={styles.animationImage} 
                resizeMode="contain"
              />
            </Animated.View>
            <View style={styles.animationTrack} />
          </View>

          <Text style={styles.inputLabel}>Leave Type</Text>
          <View style={styles.leaveTypeWrap}>
            {LEAVE_TYPES.map((item) => {
              const isActive = leaveType === item.value;
              return (
                <Pressable
                  key={item.value}
                  style={[styles.leaveTypeCard, isActive && styles.leaveTypeCardActive]}
                  onPress={() => setLeaveType(item.value)}
                >
                  <View style={[styles.leaveTypeIconWrap, isActive && styles.leaveTypeIconWrapActive]}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={isActive ? "#fff" : Colors.subtext}
                    />
                  </View>
                  <Text style={[styles.leaveTypeLabel, isActive && styles.leaveTypeLabelActive]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.leaveTypeDesc, isActive && styles.leaveTypeDescActive]}>
                    {item.desc}
                  </Text>
                  {isActive && (
                    <View style={styles.checkMark}>
                      <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.inputLabel}>Visit Place</Text>
          <Pressable
            style={styles.dropdownTrigger}
            onPress={() => setShowVisitDropdown(!showVisitDropdown)}
          >
            <Ionicons name="location-outline" size={16} color={Colors.muted} />
            <Text style={[styles.dropdownText, !visitPlace && styles.dropdownPlaceholder]}>
              {visitPlace || "Select visit place"}
            </Text>
            <Ionicons
              name={showVisitDropdown ? "chevron-up" : "chevron-down"}
              size={16}
              color={Colors.muted}
            />
          </Pressable>
          {showVisitDropdown && (
            <View style={styles.dropdownList}>
              {VISIT_PLACES.map((place) => (
                <Pressable
                  key={place}
                  style={[styles.dropdownItem, visitPlace === place && styles.dropdownItemActive]}
                  onPress={() => {
                    setVisitPlace(place);
                    setShowVisitDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      visitPlace === place && styles.dropdownItemTextActive,
                    ]}
                  >
                    {place}
                  </Text>
                  {visitPlace === place && (
                    <Ionicons name="checkmark" size={16} color={Colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>
          )}

          <Text style={styles.inputLabel}>Start Date & Time of Leave</Text>
          <Pressable 
            style={styles.inputRow} 
            onPress={() => {
              setActivePicker("start");
              setShowCalendar(true);
            }}
          >
            <Ionicons name="calendar-outline" size={16} color={Colors.muted} style={styles.inputIcon} />
            <View style={styles.inputWithIcon}>
              <Text style={[styles.inputText, !startDate && styles.inputPlaceholder]}>
                {startDate || "Select start date and time"}
              </Text>
            </View>
            <Ionicons name="time-outline" size={16} color={Colors.muted} />
          </Pressable>

          <Text style={styles.inputLabel}>Leave Ending Date & Time</Text>
          <Pressable 
            style={styles.inputRow} 
            onPress={() => {
              setActivePicker("end");
              setShowCalendar(true);
            }}
          >
            <Ionicons name="calendar-outline" size={16} color={Colors.muted} style={styles.inputIcon} />
            <View style={styles.inputWithIcon}>
              <Text style={[styles.inputText, !endDate && styles.inputPlaceholder]}>
                {endDate || "Select return date and time"}
              </Text>
            </View>
            <Ionicons name="time-outline" size={16} color={Colors.muted} />
          </Pressable>

          <Text style={styles.inputLabel}>Reason of Leaving</Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="Describe your reason for leaving the hostel"
            placeholderTextColor={Colors.subtext}
            style={styles.textArea}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.inputLabel}>Mobile No</Text>
          <View style={styles.inputRow}>
            <Ionicons name="call-outline" size={16} color={Colors.muted} style={styles.inputIcon} />
            <TextInput
              value={mobileNo}
              onChangeText={setMobileNo}
              placeholder="Enter your contact number"
              placeholderTextColor={Colors.subtext}
              style={styles.inputWithIconText}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.infoBanner}>
            <Ionicons name="information-circle-outline" size={18} color={Colors.info} />
            <Text style={styles.infoText}>
              Your leave request will be in <Text style={styles.infoBold}>Pending</Text> status until approved by the hostel admin.
            </Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.resetBtn} onPress={handleReset}>
              <Ionicons name="refresh-outline" size={16} color={Colors.subtext} />
              <Text style={styles.resetBtnText}>Reset</Text>
            </Pressable>
            <View style={styles.submitWrap}>
              <Button title="Submit Leave" onPress={handleSubmit} />
            </View>
          </View>
        </Card>

        <CalendarModal 
          visible={showCalendar} 
          onClose={() => setShowCalendar(false)} 
          onSelect={handleDateSelect}
          initialDate={activePicker === "start" ? startDate.split(' ')[0] : endDate.split(' ')[0]}
        />
        <TimePickerModal 
          visible={showTimePicker} 
          onClose={() => setShowTimePicker(false)} 
          onSelect={handleTimeSelect}
          leaveType={leaveType}
        />
      </ScrollView>
    </StudentShell>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: 14,
    paddingBottom: 24,
  },
  formCard: {
    gap: 12,
    padding: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  animationContainer: {
    height: 60,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    justifyContent: 'flex-end',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  animationImage: {
    width: 50,
    height: 50,
  },
  animationTrack: {
    height: 2,
    backgroundColor: Colors.border,
    width: '100%',
  },
  inputLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  leaveTypeWrap: {
    flexDirection: "row",
    gap: 10,
  },
  leaveTypeCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.card,
    position: "relative",
  },
  leaveTypeCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + "18",
  },
  leaveTypeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  leaveTypeIconWrapActive: {
    backgroundColor: Colors.primary,
  },
  leaveTypeLabel: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  leaveTypeLabelActive: {
    color: Colors.primary,
  },
  leaveTypeDesc: {
    color: Colors.muted,
    fontSize: 10,
    textAlign: "center",
    lineHeight: 13,
  },
  leaveTypeDescActive: {
    color: Colors.subtext,
  },
  checkMark: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
  },
  dropdownText: {
    flex: 1,
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  dropdownPlaceholder: {
    color: Colors.subtext,
    fontWeight: "500",
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.card,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemActive: {
    backgroundColor: Colors.primaryLight + "30",
  },
  dropdownItemText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "500",
  },
  dropdownItemTextActive: {
    color: Colors.primary,
    fontWeight: "700",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  inputText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "500",
  },
  inputPlaceholder: {
    color: Colors.subtext,
  },
  inputWithIconText: {
    flex: 1,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 13,
    outlineStyle: 'none',
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 90,
    color: Colors.text,
    fontSize: 13,
    textAlignVertical: "top",
    outlineStyle: 'none',
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: Colors.infoLight,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.info + "30",
  },
  infoText: {
    flex: 1,
    color: Colors.text,
    fontSize: 12,
    lineHeight: 18,
  },
  infoBold: {
    fontWeight: "800",
    color: Colors.warning,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.card,
  },
  resetBtnText: {
    color: Colors.subtext,
    fontSize: 14,
    fontWeight: "600",
  },
  submitWrap: {
    flex: 1,
  },
});
