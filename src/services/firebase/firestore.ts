import { ComplaintPriorities } from "@/constants/complaintPriorities";
import type { Complaint, HostelLeave, Notice } from "@/types";

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

let mockHostelLeaves: HostelLeave[] = [
  {
    id: "leave-1",
    studentId: "stu-1",
    studentName: "Rahul Sharma",
    roomNumber: "A-201",
    leaveType: "day",
    visitPlace: "Home",
    reason: "Family function at home",
    startDate: "2026-04-20T09:00:00",
    endDate: "2026-04-20T18:00:00",
    appliedAt: "2026-04-19T14:30:00",
    status: "approved",
    mobileNo: "9876543210",
  },
  {
    id: "leave-2",
    studentId: "stu-1",
    studentName: "Rahul Sharma",
    roomNumber: "A-201",
    leaveType: "night",
    visitPlace: "Local Guardian",
    reason: "Staying at local guardian's place for medical follow-up",
    startDate: "2026-04-22T17:00:00",
    endDate: "2026-04-23T08:00:00",
    appliedAt: "2026-04-21T10:00:00",
    status: "pending",
    mobileNo: "9876543210",
  },
  {
    id: "leave-3",
    studentId: "stu-2",
    studentName: "Priya Patel",
    roomNumber: "B-105",
    leaveType: "vacation",
    visitPlace: "Home",
    reason: "Going home for semester break",
    startDate: "2026-04-25T08:00:00",
    endDate: "2026-05-05T18:00:00",
    appliedAt: "2026-04-22T09:00:00",
    status: "pending",
    mobileNo: "9123456780",
  },
];

export const getSeedHostelLeaves = (): HostelLeave[] => {
  return mockHostelLeaves;
};

export const addHostelLeave = (leave: HostelLeave) => {
  mockHostelLeaves = [leave, ...mockHostelLeaves];
};

export const updateHostelLeaveStatus = (id: string, status: any) => {
  mockHostelLeaves = mockHostelLeaves.map(l => l.id === id ? { ...l, status } : l);
};
