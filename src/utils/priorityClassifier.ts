import { ComplaintPriorities, type ComplaintPriority } from "@/constants/complaintPriorities";

const KEYWORD_MAP: Record<ComplaintPriority, string[]> = {
  [ComplaintPriorities.CRITICAL]: ["fire", "electric shock", "short circuit", "gas leak", "security breach", "assault"],
  [ComplaintPriorities.HIGH]: ["water leakage", "no water", "power cut", "broken lock", "theft", "unsafe"],
  [ComplaintPriorities.MEDIUM]: ["internet", "wifi", "cleaning", "mess", "noise", "fan"],
  [ComplaintPriorities.LOW]: ["suggestion", "request", "minor", "paint", "light"]
};

export const classifyComplaintPriority = (text: string): ComplaintPriority => {
  const normalized = text.toLowerCase();

  for (const [priority, keywords] of Object.entries(KEYWORD_MAP) as [ComplaintPriority, string[]][]) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return priority;
    }
  }

  return ComplaintPriorities.MEDIUM;
};