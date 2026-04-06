import { useCallback, useMemo, useState } from "react";
import { seedRooms } from "@/data/adminSeedData";
import type { RoomDetails } from "@/types";

export const useRooms = () => {
  const [rooms, setRooms] = useState<RoomDetails[]>(seedRooms);

  const addRoom = useCallback((room: Omit<RoomDetails, "id">) => {
    const newRoom: RoomDetails = {
      ...room,
      id: `room-${Date.now()}`,
    };
    setRooms((prev) => [...prev, newRoom]);
  }, []);

  const updateRoom = useCallback((id: string, data: Partial<RoomDetails>) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
  }, []);

  const deleteRoom = useCallback((id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const assignStudent = useCallback((roomId: string, studentId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId && r.occupants.length < r.capacity) {
          return {
            ...r,
            occupants: [...r.occupants, studentId],
            status: "occupied" as const,
          };
        }
        return r;
      })
    );
  }, []);

  const removeStudent = useCallback((roomId: string, studentId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const newOccupants = r.occupants.filter((o) => o !== studentId);
          return {
            ...r,
            occupants: newOccupants,
            status: newOccupants.length === 0 ? ("available" as const) : r.status,
          };
        }
        return r;
      })
    );
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
