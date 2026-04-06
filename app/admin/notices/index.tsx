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
import { Colors } from "@/constants/colors";
import { useAdminNotices } from "@/hooks/useAdminNotices";
import type { Notice } from "@/types";
import { formatDateTime } from "@/utils/formatters";

const CATEGORIES = ["General", "Maintenance", "Fee", "Events", "Mess", "Academic"];

export default function AdminNoticesScreen() {
  const { notices, addNotice, updateNotice, deleteNotice } = useAdminNotices();
  const [modalVisible, setModalVisible] = useState(false);
  const [editNotice, setEditNotice] = useState<Notice | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("General");

  const clearForm = () => {
    setFormTitle("");
    setFormContent("");
    setFormCategory("General");
  };

  const openAddModal = () => {
    setEditNotice(null);
    clearForm();
    setModalVisible(true);
  };

  const openEditModal = (notice: Notice) => {
    setEditNotice(notice);
    setFormTitle(notice.title);
    setFormContent(notice.content);
    setFormCategory(notice.category ?? "General");
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (!formTitle.trim() || !formContent.trim()) return;

    if (editNotice) {
      updateNotice(editNotice.id, {
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
      });
    } else {
      addNotice({
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        isActive: true,
      });
    }
    setModalVisible(false);
    clearForm();
  };

  const getCategoryIcon = (category: string) => {
    const map: Record<string, string> = {
      General: "📢",
      Maintenance: "🔧",
      Fee: "💰",
      Events: "🎉",
      Mess: "🍽️",
      Academic: "📚",
    };
    return map[category] ?? "📌";
  };

  const getCategoryColor = (category: string) => {
    const map: Record<string, string> = {
      General: Colors.primary,
      Maintenance: Colors.warning,
      Fee: Colors.success,
      Events: "#ec4899",
      Mess: Colors.secondary,
      Academic: Colors.info,
    };
    return map[category] ?? Colors.primary;
  };

  return (
    <AdminShell title="Notice Management">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <SectionHeader
          title="Notices"
          subtitle={`${notices.length} total notices`}
          rightElement={<Button title="+ Add Notice" onPress={openAddModal} />}
        />

        {/* Active vs Inactive Count */}
        <View style={styles.countRow}>
          <View style={[styles.countBadge, { backgroundColor: Colors.successLight }]}>
            <Text style={[styles.countText, { color: Colors.success }]}>
              {notices.filter((n) => n.isActive !== false).length} Active
            </Text>
          </View>
          <View style={[styles.countBadge, { backgroundColor: Colors.surface }]}>
            <Text style={[styles.countText, { color: Colors.subtext }]}>
              {notices.filter((n) => n.isActive === false).length} Inactive
            </Text>
          </View>
        </View>

        {/* Notice Cards */}
        <View style={styles.noticeList}>
          {notices.map((notice) => (
            <Card key={notice.id} style={styles.noticeCard}>
              <View style={styles.noticeHeader}>
                {/* Category & Status */}
                <View style={styles.noticeLeft}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(notice.category ?? "General") + "18" },
                    ]}
                  >
                    <Text style={styles.categoryIcon}>
                      {getCategoryIcon(notice.category ?? "General")}
                    </Text>
                    <Text
                      style={[
                        styles.categoryText,
                        { color: getCategoryColor(notice.category ?? "General") },
                      ]}
                    >
                      {notice.category ?? "General"}
                    </Text>
                  </View>
                  {notice.isActive !== false ? (
                    <View style={[styles.activeBadge, { backgroundColor: Colors.successLight }]}>
                      <View style={[styles.activeDot, { backgroundColor: Colors.success }]} />
                      <Text style={[styles.activeText, { color: Colors.success }]}>Active</Text>
                    </View>
                  ) : (
                    <View style={[styles.activeBadge, { backgroundColor: Colors.surface }]}>
                      <View style={[styles.activeDot, { backgroundColor: Colors.muted }]} />
                      <Text style={[styles.activeText, { color: Colors.muted }]}>Inactive</Text>
                    </View>
                  )}
                </View>

                {/* Actions */}
                <View style={styles.noticeActions}>
                  <Pressable
                    style={styles.toggleBtn}
                    onPress={() =>
                      updateNotice(notice.id, { isActive: notice.isActive === false })
                    }
                  >
                    <Text style={styles.toggleText}>
                      {notice.isActive !== false ? "Deactivate" : "Activate"}
                    </Text>
                  </Pressable>
                  <Pressable style={styles.editBtn} onPress={() => openEditModal(notice)}>
                    <Text style={styles.editBtnText}>✏️</Text>
                  </Pressable>
                  <Pressable
                    style={styles.deleteBtn}
                    onPress={() => setDeleteConfirm(notice.id)}
                  >
                    <Text style={styles.deleteBtnText}>🗑️</Text>
                  </Pressable>
                </View>
              </View>

              <Text style={styles.noticeTitle}>{notice.title}</Text>
              <Text style={styles.noticeContent}>{notice.content}</Text>
              <Text style={styles.noticeDate}>
                Posted on {formatDateTime(notice.postedAt)}
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editNotice ? "Edit Notice" : "Post New Notice"}
            </Text>
            <Input label="Title" value={formTitle} onChangeText={setFormTitle} placeholder="Notice title" />
            <Input
              label="Content"
              value={formContent}
              onChangeText={setFormContent}
              placeholder="Write notice content..."
              multiline
              numberOfLines={4}
              style={{ minHeight: 100, textAlignVertical: "top" }}
            />
            <View style={styles.categorySelect}>
              <Text style={styles.categorySelectLabel}>Category</Text>
              <View style={styles.categoryOptions}>
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    style={[
                      styles.categoryOption,
                      formCategory === cat && styles.categoryOptionActive,
                    ]}
                    onPress={() => setFormCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        formCategory === cat && styles.categoryOptionTextActive,
                      ]}
                    >
                      {getCategoryIcon(cat)} {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} variant="secondary" />
              <Button title={editNotice ? "Update" : "Post Notice"} onPress={handleSubmit} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation */}
      <Modal visible={deleteConfirm !== null} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmIcon}>⚠️</Text>
            <Text style={styles.confirmTitle}>Delete Notice?</Text>
            <Text style={styles.confirmText}>
              This notice will be permanently removed from the system.
            </Text>
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setDeleteConfirm(null)} variant="secondary" />
              <Button
                title="Delete"
                onPress={() => {
                  if (deleteConfirm) deleteNotice(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                variant="danger"
              />
            </View>
          </View>
        </View>
      </Modal>
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: 16, paddingBottom: 24 },

  countRow: { flexDirection: "row", gap: 10 },
  countBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: "700",
  },

  noticeList: { gap: 14 },
  noticeCard: { padding: 18, gap: 10 },
  noticeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noticeLeft: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryIcon: { fontSize: 14 },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  noticeActions: {
    flexDirection: "row",
    gap: 6,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.subtext,
  },
  editBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editBtnText: { fontSize: 14 },
  deleteBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.dangerLight,
  },
  deleteBtnText: { fontSize: 14 },
  noticeTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },
  noticeContent: {
    fontSize: 14,
    color: Colors.subtext,
    lineHeight: 21,
  },
  noticeDate: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
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
    maxWidth: 520,
    gap: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  categorySelect: { gap: 6 },
  categorySelectLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  categoryOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.subtext,
  },
  categoryOptionTextActive: {
    color: "#fff",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },

  // Confirm
  confirmModal: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    gap: 12,
  },
  confirmIcon: { fontSize: 40 },
  confirmTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
  confirmText: { fontSize: 14, color: Colors.subtext, textAlign: "center" },
});