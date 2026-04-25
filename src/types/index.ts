import type { ComplaintPriority } from "@/constants/complaintPriorities";
import type { UserRole } from "@/constants/roles";

export type { ComplaintPriority };

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roomNumber?: string;
  phone?: string;
  enrollmentNo?: string;
  course?: string;
  year?: number;
  joinDate?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "open" | "in-progress" | "resolved";
  priority: ComplaintPriority;
  createdAt: string;
  createdBy: string;
  studentName?: string;
  roomNumber?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  postedAt: string;
  postedBy: string;
  category?: string;
  isActive?: boolean;
}

export interface RoomDetails {
  id: string;
  roomNumber: string;
  block: string;
  floor: number;
  capacity: number;
  occupants: string[];
  status: "available" | "occupied" | "maintenance";
}

export interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "overdue";
  semester: string;
}

export interface MessMenu {
  id: string;
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface MessFeedback {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  meal: "breakfast" | "lunch" | "snacks" | "dinner";
  date: string;
}

export interface DashboardStat {
  label: string;
  value: number;
  tone?: "primary" | "secondary" | "success" | "warning" | "danger";
  change?: number;
  icon?: string;
}

export type LeaveType = "day" | "night" | "vacation";
export type LeaveStatus = "pending" | "approved" | "rejected";
export type VisitPlace =
  | "Home"
  | "Local Guardian"
  | "Personal Grooming"
  | "Medical Checkup"
  | "Academic Purposes"
  | "Local Visit"
  | "Out Station Visit"
  | "Coaching"
  | "Placement"
  | "Other";

export interface HostelLeave {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  leaveType: LeaveType;
  visitPlace: VisitPlace;
  reason: string;
  startDate: string;
  endDate: string;
  appliedAt: string;
  status: LeaveStatus;
  mobileNo: string;
}