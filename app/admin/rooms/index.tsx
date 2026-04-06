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
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FilterChips } from "@/components/ui/FilterChips";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SearchBar } from "@/components/ui/SearchBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Colors } from "@/constants/colors";
import { useRooms } from "@/hooks/useRooms";
import { useStudents } from "@/hooks/useStudents";
import type { RoomDetails } from "@/types";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Available", value: "available" },
  { label: "Occupied", value: "occupied" },
  { label: "Maintenance", value: "maintenance" },
];

const BLOCK_FILTERS = [
  { label: "All Blocks", value: "all" },
  { label: "Block A", value: "A" },
  { label: "Block B", value: "B" },
  { label: "Block C", value: "C" },
  { label: "Block D", value: "D" },
];

export default function AdminRoomsScreen() {
  const { rooms, addRoom, updateRoom, deleteRoom, removeStudent, stats } = useRooms();
  const { students } = useStudents();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [blockFilter, setBlockFilter] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [editRoom, setEditRoom] = useState<RoomDetails | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form
  const [formRoomNumber, setFormRoomNumber] = useState("");
  const [formBlock, setFormBlock] = useState("");
  const [formFloor, setFormFloor] = useState("");
  const [formCapacity, setFormCapacity] = useState("");

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      const matchesSearch = r.roomNumber.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesBlock = blockFilter === "all" || r.block === blockFilter;
      return matchesSearch && matchesStatus && matchesBlock;
    });
  }, [rooms, search, statusFilter, blockFilter]);

  const getStudentName = (id: string) => {
    const student = students.find((s) => s.id === id);
    return student?.name ?? id;
  };

  const statusColor = (status: RoomDetails["status"]) => {
    switch (status) {
      case "available":
        return Colors.success;
      case "occupied":
        return Colors.primary;
      case "maintenance":
        return Colors.warning;
    }
  };

  const statusBg = (status: RoomDetails["status"]) => {
    switch (status) {
      case "available":
        return Colors.successLight;
      case "occupied":
        return Colors.primaryLight;
      case "maintenance":
        return Colors.warningLight;
    }
  };

  const openAddModal = () => {
    setEditRoom(null);
    setFormRoomNumber("");
    setFormBlock("");
    setFormFloor("");
    setFormCapacity("");
    setModalVisible(true);
  };

  const openEditModal = (room: RoomDetails) => {
    setEditRoom(room);
    setFormRoomNumber(room.roomNumber);
    setFormBlock(room.block);
    setFormFloor(room.floor.toString());
    setFormCapacity(room.capacity.toString());
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (!formRoomNumber.trim() || !formBlock.trim()) return;
    if (editRoom) {
      updateRoom(editRoom.id, {
        roomNumber: formRoomNumber.trim(),
        block: formBlock.trim(),
        floor: parseInt(formFloor, 10) || 1,
        capacity: parseInt(formCapacity, 10) || 2,
      });
    } else {
      addRoom({
        roomNumber: formRoomNumber.trim(),
        block: formBlock.trim(),
        floor: parseInt(formFloor, 10) || 1,
        capacity: parseInt(formCapacity, 10) || 2,
        occupants: [],
        status: "available",
      });
    }
    setModalVisible(false);
  };

  return (
    <AdminShell title="Room Management">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard label="Total Rooms" value={stats.total} icon="🏠" iconBg={Colors.infoLight} />
          <StatCard label="Occupied" value={stats.occupied} icon="🛏️" iconBg={Colors.primaryLight} />
          <StatCard label="Available" value={stats.available} icon="✅" iconBg={Colors.successLight} />
          <StatCard label="Maintenance" value={stats.maintenance} icon="🔧" iconBg={Colors.warningLight} />
        </View>

        {/* Occupancy Progress */}
        <Card style={styles.occupancyCard}>
          <Text style={styles.occupancyTitle}>Overall Occupancy</Text>
          <ProgressBar
            value={stats.totalOccupants}
            maxValue={stats.totalCapacity}
            color={Colors.primary}
            label={`${stats.totalOccupants} of ${stats.totalCapacity} beds filled`}
          />
        </Card>

        <SectionHeader
          title="All Rooms"
          subtitle={`${filtered.length} rooms found`}
          rightElement={<Button title="+ Add Room" onPress={openAddModal} />}
        />

        {/* Filters */}
        <View style={styles.filtersRow}>
          <View style={styles.searchWrap}>
            <SearchBar value={search} onChangeText={setSearch} placeholder="Search room number..." />
          </View>
        </View>
        <FilterChips options={STATUS_FILTERS} selected={statusFilter} onSelect={setStatusFilter} />
        <FilterChips options={BLOCK_FILTERS} selected={blockFilter} onSelect={setBlockFilter} />

        {/* Room Grid */}
        <View style={styles.roomGrid}>
          {filtered.map((room) => (
            <Card key={room.id} style={styles.roomCard}>
              <View style={styles.roomHeader}>
                <Text style={styles.roomNumber}>{room.roomNumber}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusBg(room.status) }]}>
                  <Text style={[styles.statusText, { color: statusColor(room.status) }]}>
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.roomInfo}>
                <InfoRow label="Block" value={room.block} />
                <InfoRow label="Floor" value={`${room.floor}`} />
                <InfoRow label="Capacity" value={`${room.occupants.length}/${room.capacity}`} />
              </View>

              {/* Occupancy bar */}
              <ProgressBar
                value={room.occupants.length}
                maxValue={room.capacity}
                color={room.occupants.length >= room.capacity ? Colors.danger : Colors.success}
                showPercentage={false}
              />

              {/* Occupants */}
              {room.occupants.length > 0 && (
                <View style={styles.occupants}>
                  <Text style={styles.occupantsLabel}>Occupants:</Text>
                  {room.occupants.map((occ) => (
                    <View key={occ} style={styles.occupantRow}>
                      <Text style={styles.occupantName}>{getStudentName(occ)}</Text>
                      <Pressable onPress={() => removeStudent(room.id, occ)}>
                        <Text style={styles.removeText}>✕</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              {/* Actions */}
              <View style={styles.roomActions}>
                <Pressable style={styles.editRoomBtn} onPress={() => openEditModal(room)}>
                  <Text style={styles.editRoomText}>✏️ Edit</Text>
                </Pressable>
                <Pressable
                  style={styles.deleteRoomBtn}
                  onPress={() => setDeleteConfirm(room.id)}
                >
                  <Text style={styles.deleteRoomText}>🗑️</Text>
                </Pressable>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editRoom ? "Edit Room" : "Add New Room"}
            </Text>
            <Input label="Room Number" value={formRoomNumber} onChangeText={setFormRoomNumber} placeholder="A-101" />
            <Input label="Block" value={formBlock} onChangeText={setFormBlock} placeholder="A" />
            <Input label="Floor" value={formFloor} onChangeText={setFormFloor} placeholder="1" keyboardType="numeric" />
            <Input label="Capacity" value={formCapacity} onChangeText={setFormCapacity} placeholder="3" keyboardType="numeric" />
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} variant="secondary" />
              <Button title={editRoom ? "Update" : "Add Room"} onPress={handleSubmit} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation */}
      <Modal visible={deleteConfirm !== null} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmIcon}>⚠️</Text>
            <Text style={styles.confirmTitle}>Delete Room?</Text>
            <Text style={styles.confirmText}>
              This will permanently remove the room and unassign all occupants.
            </Text>
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setDeleteConfirm(null)} variant="secondary" />
              <Button
                title="Delete"
                onPress={() => {
                  if (deleteConfirm) deleteRoom(deleteConfirm);
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

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  scroll: { gap: 16, paddingBottom: 24 },
  statsRow: { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  occupancyCard: { padding: 18, gap: 12 },
  occupancyTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  filtersRow: { flexDirection: "row", gap: 12 },
  searchWrap: { flex: 1, maxWidth: 400 },

  // Room Grid
  roomGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  roomCard: {
    width: 280,
    padding: 16,
    gap: 12,
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  roomInfo: { gap: 4 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.subtext,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
  },

  // Occupants
  occupants: { gap: 4 },
  occupantsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.subtext,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  occupantRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: Colors.surface,
    borderRadius: 6,
  },
  occupantName: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: "500",
  },
  removeText: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: "700",
  },

  // Room Actions
  roomActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  editRoomBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  editRoomText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  deleteRoomBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.dangerLight,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteRoomText: {
    fontSize: 12,
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
    maxWidth: 440,
    gap: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
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