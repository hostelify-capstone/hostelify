import type { ComplaintPriority } from "@/constants/complaintPriorities";
import type { UserRole } from "@/constants/roles";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roomNumber?: string;
  phone?: string;
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
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  postedAt: string;
  postedBy: string;
}

export interface RoomDetails {
  roomNumber: string;
  block: string;
  floor: number;
  capacity: number;
  occupants: string[];
}

export interface DashboardStat {
  label: string;
  value: number;
  tone?: "primary" | "secondary" | "success" | "warning" | "danger";
}