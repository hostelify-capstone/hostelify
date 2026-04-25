import React, { useState } from "react";
import { Modal, StyleSheet, Text, View, Pressable, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  initialDate?: string;
}

export const CalendarModal = ({ visible, onClose, onSelect, initialDate }: CalendarModalProps) => {
  const [currentDate, setCurrentDate] = useState(initialDate ? new Date(initialDate) : new Date());
  
  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const renderDays = () => {
    const totalDays = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);
    const days = [];

    // Empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      const isSelected = initialDate && new Date(initialDate).getDate() === i && 
                         new Date(initialDate).getMonth() === month &&
                         new Date(initialDate).getFullYear() === year;
      
      days.push(
        <Pressable 
          key={i} 
          style={[styles.dayCell, isSelected && styles.selectedDay]} 
          onPress={() => {
            const selected = new Date(year, month, i);
            onSelect(selected.toISOString().split('T')[0]);
            onClose();
          }}
        >
          <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{i}</Text>
        </Pressable>
      );
    }
    return days;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{monthNames[month]} {year}</Text>
            <View style={styles.headerActions}>
              <Pressable onPress={handlePrevMonth} style={styles.iconBtn}>
                <Ionicons name="chevron-back" size={20} color={Colors.text} />
              </Pressable>
              <Pressable onPress={handleNextMonth} style={styles.iconBtn}>
                <Ionicons name="chevron-forward" size={20} color={Colors.text} />
              </Pressable>
            </View>
          </View>

          <View style={styles.weekDays}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <Text key={i} style={styles.weekDayText}>{d}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {renderDays()}
          </View>

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  leaveType?: "day" | "night" | "vacation";
}

export const TimePickerModal = ({ visible, onClose, onSelect, leaveType }: TimePickerModalProps) => {
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleSelect = () => {
    // Convert to 24h for validation
    let h = parseInt(hour);
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;

    if (leaveType === "day") {
      // 12 am (0) to 7 pm (19)
      if (h < 0 || h >= 19) {
        Alert.alert(
          "Invalid Selection", 
          "You cannot select this time for Day Leave. Timing for Day Leave is 12 AM to 7 PM."
        );
        return;
      }
    } else if (leaveType === "night") {
      // 7 pm (19) to 12 am (24/0)
      if (h < 19 && h !== 0) {
        Alert.alert(
          "Invalid Selection", 
          "You cannot select this time for Night Leave. Timing for Night Leave is 7 PM to 12 AM."
        );
        return;
      }
    }

    onSelect(`${hour}:${minute} ${ampm}`);
    onClose();
  };


  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Time</Text>
          
          <View style={styles.timePickerContainer}>
            <View style={styles.pickerHighlight} />
            <ScrollView 
              style={styles.timeColumn} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.timeColumnContent}
            >
              {hours.map(h => (
                <Pressable key={h} onPress={() => setHour(h)} style={[styles.timeOption, hour === h && styles.selectedOption]}>
                  <Text style={[styles.timeOptionText, hour === h && styles.selectedOptionText]}>{h}</Text>
                </Pressable>
              ))}
            </ScrollView>
            
            <Text style={styles.timeSeparator}>:</Text>

            <ScrollView 
              style={styles.timeColumn} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.timeColumnContent}
            >
              {minutes.map(m => (
                <Pressable key={m} onPress={() => setMinute(m)} style={[styles.timeOption, minute === m && styles.selectedOption]}>
                  <Text style={[styles.timeOptionText, minute === m && styles.selectedOptionText]}>{m}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.ampmColumn}>
              <Pressable onPress={() => setAmpm("AM")} style={[styles.ampmBtn, ampm === "AM" && styles.selectedAmpm]}>
                <Text style={[styles.ampmText, ampm === "AM" && styles.selectedAmpmText]}>AM</Text>
              </Pressable>
              <Pressable onPress={() => setAmpm("PM")} style={[styles.ampmBtn, ampm === "PM" && styles.selectedAmpm]}>
                <Text style={[styles.ampmText, ampm === "PM" && styles.selectedAmpmText]}>PM</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.okBtn} onPress={handleSelect}>
              <Text style={styles.okBtnText}>Set Time</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    width: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    padding: 5,
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  weekDayText: {
    width: 35,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: Colors.muted,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedDay: {
    backgroundColor: Colors.primary,
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "700",
  },
  closeBtn: {
    marginTop: 20,
    alignItems: "center",
  },
  closeBtnText: {
    color: Colors.subtext,
    fontWeight: "600",
  },
  // Time Picker Styles
  timePickerContainer: {
    flexDirection: "row",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    position: 'relative',
  },
  pickerHighlight: {
    position: 'absolute',
    height: 44,
    width: '100%',
    backgroundColor: Colors.primaryLight + "15",
    borderRadius: 10,
    zIndex: -1,
  },
  timeColumn: {
    flex: 1,
    height: '100%',
  },
  timeColumnContent: {
    paddingVertical: 68, // Center the items
  },
  timeOption: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedOption: {
    // No background here because of pickerHighlight
  },
  timeOptionText: {
    fontSize: 18,
    color: Colors.subtext,
    fontWeight: "500",
  },
  selectedOptionText: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: "700",
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginHorizontal: 8,
    paddingBottom: 4,
  },
  ampmColumn: {
    width: 70,
    gap: 8,
    marginLeft: 10,
    justifyContent: 'center',
  },
  ampmBtn: {
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  selectedAmpm: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  ampmText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.subtext,
  },
  selectedAmpmText: {
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.border + "50",
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cancelBtnText: {
    color: Colors.subtext,
    fontSize: 15,
    fontWeight: "600",
  },
  okBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  okBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});

