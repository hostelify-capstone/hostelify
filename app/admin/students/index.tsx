import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AdminShell } from "@/components/layout/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FilterChips } from "@/components/ui/FilterChips";
import { Input } from "@/components/ui/Input";
import { SearchBar } from "@/components/ui/SearchBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Colors } from "@/constants/colors";
import { useStudents } from "@/hooks/useStudents";
import type { AppUser } from "@/types";

export default function AdminStudentsScreen() {
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [editStudent, setEditStudent] = useState<AppUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEnrollment, setFormEnrollment] = useState("");
  const [formCourse, setFormCourse] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formRoom, setFormRoom] = useState("");

  const courses = useMemo(() => {
    const set = new Set(students.map((s) => s.course ?? ""));
    return [
      { label: "All", value: "all" },
      ...Array.from(set)
        .filter(Boolean)
        .map((c) => ({ label: c, value: c })),
    ];
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.enrollmentNo ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesCourse = courseFilter === "all" || s.course === courseFilter;
      return matchesSearch && matchesCourse;
    });
  }, [students, search, courseFilter]);

  const openAddModal = () => {
    setEditStudent(null);
    clearForm();
    setModalVisible(true);
  };

  const openEditModal = (student: AppUser) => {
    setEditStudent(student);
    setFormName(student.name);
    setFormEmail(student.email);
    setFormPhone(student.phone ?? "");
    setFormEnrollment(student.enrollmentNo ?? "");
    setFormCourse(student.course ?? "");
    setFormYear(student.year?.toString() ?? "");
    setFormRoom(student.roomNumber ?? "");
    setModalVisible(true);
  };

  const clearForm = () => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormEnrollment("");
    setFormCourse("");
    setFormYear("");
    setFormRoom("");
  };

  const handleSubmit = () => {
    if (!formName.trim() || !formEmail.trim()) return;

    if (editStudent) {
      updateStudent(editStudent.id, {
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim() || undefined,
        enrollmentNo: formEnrollment.trim() || undefined,
        course: formCourse.trim() || undefined,
        year: formYear ? parseInt(formYear, 10) : undefined,
        roomNumber: formRoom.trim() || undefined,
      });
    } else {
      addStudent({
        name: formName.trim(),
        email: formEmail.trim(),
        role: "student",
        phone: formPhone.trim() || undefined,
        enrollmentNo: formEnrollment.trim() || undefined,
        course: formCourse.trim() || undefined,
        year: formYear ? parseInt(formYear, 10) : undefined,
        roomNumber: formRoom.trim() || undefined,
        joinDate: new Date().toISOString().split("T")[0],
      });
    }
    setModalVisible(false);
    clearForm();
  };

  const handleDelete = (id: string) => {
    deleteStudent(id);
    setDeleteConfirm(null);
  };

  return (
    <AdminShell title="Student Management">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <SectionHeader
          title="Students"
          subtitle={`${students.length} total students enrolled`}
          rightElement={
            <Button title="+ Add Student" onPress={openAddModal} />
          }
        />

        {/* Filters */}
        <View style={styles.filtersRow}>
          <View style={styles.searchWrap}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search by name, email, enrollment..."
            />
          </View>
        </View>
        <FilterChips options={courses} selected={courseFilter} onSelect={setCourseFilter} />

        {/* Table */}
        <Card style={styles.tableCard}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colName]}>Student</Text>
            <Text style={[styles.tableHeaderText, styles.colEnroll]}>Enrollment</Text>
            <Text style={[styles.tableHeaderText, styles.colCourse]}>Course</Text>
            <Text style={[styles.tableHeaderText, styles.colRoom]}>Room</Text>
            <Text style={[styles.tableHeaderText, styles.colYear]}>Year</Text>
            <Text style={[styles.tableHeaderText, styles.colActions]}>Actions</Text>
          </View>

          {/* Rows */}
          {filtered.map((student, idx) => (
            <View
              key={student.id}
              style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}
            >
              <View style={[styles.colName, styles.studentCell]}>
                <View style={styles.studentAvatar}>
                  <Text style={styles.avatarText}>
                    {student.name.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentEmail}>{student.email}</Text>
                </View>
              </View>
              <Text style={[styles.cellText, styles.colEnroll]}>
                {student.enrollmentNo ?? "—"}
              </Text>
              <View style={styles.colCourse}>
                <Badge label={student.course ?? "N/A"} tone="primary" />
              </View>
              <Text style={[styles.cellText, styles.colRoom]}>
                {student.roomNumber ?? "Unassigned"}
              </Text>
              <Text style={[styles.cellText, styles.colYear]}>
                {student.year ? `Year ${student.year}` : "—"}
              </Text>
              <View style={[styles.colActions, styles.actionsCell]}>
                <Pressable
                  style={styles.actionBtn}
                  onPress={() => openEditModal(student)}
                >
                  <Text style={styles.editText}>✏️ Edit</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => setDeleteConfirm(student.id)}
                >
                  <Text style={styles.deleteText}>🗑️</Text>
                </Pressable>
              </View>
            </View>
          ))}

          {filtered.length === 0 && (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>No students found</Text>
            </View>
          )}
        </Card>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editStudent ? "Edit Student" : "Add New Student"}
            </Text>
            <ScrollView style={styles.modalForm}>
              <Input label="Full Name" value={formName} onChangeText={setFormName} placeholder="Enter full name" />
              <Input label="Email" value={formEmail} onChangeText={setFormEmail} placeholder="student@hostel.com" keyboardType="email-address" />
              <Input label="Phone" value={formPhone} onChangeText={setFormPhone} placeholder="+91 XXXXX XXXXX" keyboardType="phone-pad" />
              <Input label="Enrollment No" value={formEnrollment} onChangeText={setFormEnrollment} placeholder="EN2024XXX" />
              <Input label="Course" value={formCourse} onChangeText={setFormCourse} placeholder="B.Tech CSE" />
              <Input label="Year" value={formYear} onChangeText={setFormYear} placeholder="1-4" keyboardType="numeric" />
              <Input label="Room Number" value={formRoom} onChangeText={setFormRoom} placeholder="A-101" />
            </ScrollView>
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} variant="secondary" />
              <Button title={editStudent ? "Update" : "Add Student"} onPress={handleSubmit} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={deleteConfirm !== null} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmIcon}>⚠️</Text>
            <Text style={styles.confirmTitle}>Delete Student?</Text>
            <Text style={styles.confirmText}>
              This action cannot be undone. The student will be removed from the system.
            </Text>
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setDeleteConfirm(null)} variant="secondary" />
              <Button title="Delete" onPress={() => deleteConfirm && handleDelete(deleteConfirm)} variant="danger" />
            </View>
          </View>
        </View>
      </Modal>
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: 16, paddingBottom: 24 },
  filtersRow: { flexDirection: "row", gap: 12 },
  searchWrap: { flex: 1, maxWidth: 400 },
  tableCard: { padding: 0, overflow: "hidden" },

  // Table
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.subtext,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableRowAlt: {
    backgroundColor: Colors.surface,
  },

  // Columns
  colName: { flex: 3 },
  colEnroll: { flex: 2 },
  colCourse: { flex: 2 },
  colRoom: { flex: 1.5 },
  colYear: { flex: 1 },
  colActions: { flex: 2 },

  // Student cell
  studentCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  studentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.primaryDark,
    fontSize: 15,
    fontWeight: "700",
  },
  studentName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  studentEmail: {
    fontSize: 12,
    color: Colors.subtext,
  },
  cellText: {
    fontSize: 14,
    color: Colors.text,
  },

  // Actions
  actionsCell: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deleteBtn: {
    borderColor: Colors.dangerLight,
    backgroundColor: Colors.dangerLight,
  },
  editText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  deleteText: {
    fontSize: 12,
  },
  emptyRow: {
    padding: 30,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.subtext,
    fontSize: 14,
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
    maxHeight: "80%",
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  modalForm: {
    gap: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },

  // Confirm Modal
  confirmModal: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    gap: 12,
  },
  confirmIcon: {
    fontSize: 40,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  confirmText: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: "center",
  },
});