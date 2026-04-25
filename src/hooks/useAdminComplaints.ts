import { useCallback, useEffect, useMemo, useState } from "react";
import { collections } from "@/services/firebase/firestore";
import { ComplaintPriorities } from "@/constants/complaintPriorities";
import type { Complaint, ComplaintPriority } from "@/types";
import { onSnapshot, updateDoc, doc, query, orderBy } from "firebase/firestore";

export const useAdminComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const q = query(collections.complaints);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Complaint[] = [];
      snapshot.forEach((d) => {
        data.push({ id: d.id, ...d.data() } as Complaint);
      });
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setComplaints(data);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = useCallback(
    async (id: string, status: Complaint["status"]) => {
      const docRef = doc(collections.complaints, id);
      await updateDoc(docRef, { status });
    },
    []
  );

  const updatePriority = useCallback(
    async (id: string, priority: ComplaintPriority) => {
      const docRef = doc(collections.complaints, id);
      await updateDoc(docRef, { priority });
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
