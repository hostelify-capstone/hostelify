import { useMemo, useState, useEffect } from "react";
import { ComplaintPriorities } from "@/constants/complaintPriorities";
import { collections } from "@/services/firebase/firestore";
import type { Complaint } from "@/types";
import { classifyComplaintPriority } from "@/utils/priorityClassifier";
import { onSnapshot, addDoc, query, where, orderBy } from "firebase/firestore";

interface NewComplaintInput {
  title: string;
  description: string;
  category: string;
  createdBy: string;
  studentName?: string;
  roomNumber?: string;
}

export const useComplaints = (userId?: string) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collections.complaints,
      where("createdBy", "==", userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Complaint[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Complaint);
      });
      // Sort in memory since we might need a composite index otherwise
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setComplaints(data);
    });

    return () => unsubscribe();
  }, [userId]);

  const addComplaint = async (payload: NewComplaintInput) => {
    const priority = classifyComplaintPriority(`${payload.title} ${payload.description}`);

    const newComplaint = {
      title: payload.title,
      description: payload.description,
      category: payload.category,
      status: "open",
      priority,
      createdAt: new Date().toISOString(),
      createdBy: payload.createdBy,
      studentName: payload.studentName ?? "",
      roomNumber: payload.roomNumber ?? "",
    };

    await addDoc(collections.complaints, newComplaint);
  };

  const stats = useMemo(() => {
    return {
      total: complaints.length,
      open: complaints.filter((c) => c.status === "open").length,
      highPriority: complaints.filter((c) => [ComplaintPriorities.HIGH, ComplaintPriorities.CRITICAL].includes(c.priority)).length
    };
  }, [complaints]);

  return { complaints, addComplaint, stats };
};