export const ComplaintPriorities = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical"
} as const;

export type ComplaintPriority = (typeof ComplaintPriorities)[keyof typeof ComplaintPriorities];