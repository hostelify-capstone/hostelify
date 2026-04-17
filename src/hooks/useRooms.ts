import { useCallback, useMemo, useState, useEffect } from "react";
import { collections } from "@/services/firebase/firestore";
import type { RoomDetails } from "@/types";
import { onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";

export const useRooms = () => {
  const [rooms, setRooms] = useState<RoomDetails[]>([]);

  useEffect(() => {
    const q = query(collections.rooms);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: RoomDetails[] = [];
      snapshot.forEach((d) => {
        data.push({ id: d.id, ...d.data() } as RoomDetails);
      });
      data.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
      setRooms(data);
    });

    return () => unsubscribe();
  }, []);

  const addRoom = useCallback(async (room: Omit<RoomDetails, "id">) => {
    await addDoc(collections.rooms, room);
  }, []);

  const updateRoom = useCallback(async (id: string, data: Partial<RoomDetails>) => {
    const docRef = doc(collections.rooms, id);
    await updateDoc(docRef, data);
  }, []);

  const deleteRoom = useCallback(async (id: string) => {
    const docRef = doc(collections.rooms, id);
    await deleteDoc(docRef);
  }, []);

  const assignStudent = useCallback(async (roomId: string, studentId: string) => {
    const docRef = doc(collections.rooms, roomId);
    const roomSnap = await getDoc(docRef);
    if (roomSnap.exists()) {
      const roomData = roomSnap.data() as RoomDetails;
      if (roomData.occupants.length < roomData.capacity) {
        const newOccupants = [...roomData.occupants, studentId];
        const newStatus = newOccupants.length >= roomData.capacity ? "occupied" : "available";
        await updateDoc(docRef, {
          occupants: newOccupants,
          status: newStatus,
        });
      }
    }
  }, []);

  const removeStudent = useCallback(async (roomId: string, studentId: string) => {
    const docRef = doc(collections.rooms, roomId);
    const roomSnap = await getDoc(docRef);
    if (roomSnap.exists()) {
      const roomData = roomSnap.data() as RoomDetails;
      const newOccupants = roomData.occupants.filter((o) => o !== studentId);
      const newStatus = newOccupants.length >= roomData.capacity ? "occupied" : "available";
      await updateDoc(docRef, {
        occupants: newOccupants,
        status: newStatus,
      });
    }
  }, []);

  const stats = useMemo(() => {
    const total = rooms.length;
    const occupied = rooms.filter((r) => r.status === "occupied").length;
    const available = rooms.filter((r) => r.status === "available").length;
    const maintenance = rooms.filter((r) => r.status === "maintenance").length;
    const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
    const totalOccupants = rooms.reduce((sum, r) => sum + r.occupants.length, 0);
    return { total, occupied, available, maintenance, totalCapacity, totalOccupants };
  }, [rooms]);

  return { rooms, addRoom, updateRoom, deleteRoom, assignStudent, removeStudent, stats };
};
