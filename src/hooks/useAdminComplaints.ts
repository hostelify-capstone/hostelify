import { useCallback, useMemo, useState } from "react";
import { seedComplaints } from "@/data/adminSeedData";
import { ComplaintPriorities } from "@/constants/complaintPriorities";
import type { Complaint, ComplaintPriority } from "@/types";
import type {} from "@/constants/complaintPriorities";

export const useAdminComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(seedComplaints);

  const updateStatus = useCallback(
    (id: string, status: Complaint["status"]) => {
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    },
    []
  );

  const updatePriority = useCallback(
    (id: string, priority: ComplaintPriority) => {
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, priority } : c))
      );
    },
    []
  );

  const stats = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter((c) => c.status === "open").length;
    const inProgress = complaints.filter((c) => c.status === "in-progress").length;
    const resolved = complaints.filter((c) => c.status === "resolved").length;
    const highPriority = complaints.filter((c) =>
      c.priority === ComplaintPriorities.HIGH || c.priority === ComplaintPriorities.CRITICAL
    ).length;
    const byCategory = complaints.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return { total, open, inProgress, resolved, highPriority, byCategory };
  }, [complaints]);

  return { complaints, updateStatus, updatePriority, stats };
};
