import { useMemo, useState } from "react";
import { ComplaintPriorities } from "@/constants/complaintPriorities";
import { getSeedComplaints } from "@/services/firebase/firestore";
import type { Complaint } from "@/types";
import { classifyComplaintPriority } from "@/utils/priorityClassifier";

interface NewComplaintInput {
  title: string;
  description: string;
  category: string;
  createdBy: string;
}

export const useComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(getSeedComplaints());

  const addComplaint = (payload: NewComplaintInput) => {
    const priority = classifyComplaintPriority(`${payload.title} ${payload.description}`);

    const newComplaint: Complaint = {
      id: `cmp-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      status: "open",
      priority,
      createdAt: new Date().toISOString(),
      createdBy: payload.createdBy
    };

    setComplaints((prev) => [newComplaint, ...prev]);
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