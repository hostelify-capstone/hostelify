import React, { createContext, useContext, useMemo, useState } from "react";
import { getSeedHostelLeaves, addHostelLeave as serviceAddLeave, updateHostelLeaveStatus as serviceUpdateStatus } from "@/services/firebase/firestore";
import type { HostelLeave, LeaveStatus, LeaveType, VisitPlace } from "@/types";

interface NewLeaveInput {
  studentId: string;
  studentName: string;
  roomNumber: string;
  leaveType: LeaveType;
  visitPlace: VisitPlace;
  reason: string;
  startDate: string;
  endDate: string;
  mobileNo: string;
}

interface HostelLeaveContextType {
  leaves: HostelLeave[];
  addLeave: (payload: NewLeaveInput) => void;
  updateLeaveStatus: (leaveId: string, status: LeaveStatus) => void;
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

const HostelLeaveContext = createContext<HostelLeaveContextType | undefined>(undefined);

export const HostelLeaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leaves, setLeaves] = useState<HostelLeave[]>(getSeedHostelLeaves());

  const addLeave = (payload: NewLeaveInput) => {
    const newLeave: HostelLeave = {
      id: `leave-${Date.now()}`,
      ...payload,
      appliedAt: new Date().toISOString(),
      status: "pending",
    };
    serviceAddLeave(newLeave); // Update service for persistence
    setLeaves((prev) => [newLeave, ...prev]);
  };

  const updateLeaveStatus = (leaveId: string, status: LeaveStatus) => {
    serviceUpdateStatus(leaveId, status); // Update service for persistence
    setLeaves((prev) =>
      prev.map((leave) => (leave.id === leaveId ? { ...leave, status } : leave))
    );
  };

  const stats = useMemo(() => {
    return {
      total: leaves.length,
      pending: leaves.filter((l) => l.status === "pending").length,
      approved: leaves.filter((l) => l.status === "approved").length,
      rejected: leaves.filter((l) => l.status === "rejected").length,
    };
  }, [leaves]);

  return (
    <HostelLeaveContext.Provider value={{ leaves, addLeave, updateLeaveStatus, stats }}>
      {children}
    </HostelLeaveContext.Provider>
  );
};

export const useHostelLeaves = () => {
  const context = useContext(HostelLeaveContext);
  if (context === undefined) {
    throw new Error("useHostelLeaves must be used within a HostelLeaveProvider");
  }
  return context;
};
