export const Colors = {
  primary: "#007AFF",
  secondary: "#5856D6",
  success: "#34C759",
  warning: "#FF9500",
  danger: "#FF3B30",
  background: "#f8f9fa",
  text: "#111827",
  subtext: "#6b7280",
  border: "#e5e7eb",
  card: "#ffffff"
} as const;

export type AppColor = keyof typeof Colors;