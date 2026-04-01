import { ComplaintPriorities } from "@/constants/complaintPriorities";
import type { Complaint, Notice } from "@/types";

export const getSeedComplaints = (): Complaint[] => {
  return [
    {
      id: "cmp-1",
      title: "No water in washroom",
      description: "Water has not been available since morning.",
      category: "Maintenance",
      status: "open",
      priority: ComplaintPriorities.HIGH,
      createdAt: new Date().toISOString(),
      createdBy: "student-1"
    },
    {
      id: "cmp-2",
      title: "Mess food quality issue",
      description: "Food was cold and undercooked during dinner.",
      category: "Mess",
      status: "in-progress",
      priority: ComplaintPriorities.MEDIUM,
      createdAt: new Date().toISOString(),
      createdBy: "student-1"
    }
  ];
};

export const getSeedNotices = (): Notice[] => {
  return [
    {
      id: "notice-1",
      title: "Water Tank Cleaning",
      content: "Water supply will be unavailable from 10 AM to 1 PM on Sunday.",
      postedAt: new Date().toISOString(),
      postedBy: "admin-1"
    },
    {
      id: "notice-2",
      title: "Hostel Curfew Reminder",
      content: "All students must return by 9:30 PM unless approved gate pass is active.",
      postedAt: new Date().toISOString(),
      postedBy: "admin-1"
    }
  ];
};