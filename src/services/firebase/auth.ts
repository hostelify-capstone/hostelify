import { Roles } from "@/constants/roles";
import type { AppUser } from "@/types";

const DEMO_USERS: Record<string, AppUser> = {
  "student@hostel.com": {
    id: "student-1",
    name: "Demo Student",
    email: "student@hostel.com",
    role: Roles.STUDENT,
    roomNumber: "A-204",
    phone: "+91 90000 11111"
  },
  "admin@hostel.com": {
    id: "admin-1",
    name: "Hostel Admin",
    email: "admin@hostel.com",
    role: Roles.ADMIN,
    phone: "+91 90000 22222"
  }
};

export const signInWithDemoAuth = async (email: string, password: string): Promise<AppUser> => {
  const user = DEMO_USERS[email.trim().toLowerCase()];

  if (!user || password.trim().length < 6) {
    throw new Error("Invalid credentials. Use demo accounts with any 6+ character password.");
  }

  return user;
};

export const registerDemoUser = async (name: string, email: string, password: string): Promise<AppUser> => {
  if (!name.trim() || !email.trim() || password.trim().length < 6) {
    throw new Error("Please provide valid registration details.");
  }

  return {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: Roles.STUDENT
  };
};