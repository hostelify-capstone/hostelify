export const Colors = {
  primary: "#2563eb",
  primaryLight: "#93c5fd",
  primaryDark: "#1d4ed8",
  secondary: "#3b82f6",
  secondaryLight: "#bfdbfe",
  success: "#10b981",
  successLight: "#d1fae5",
  warning: "#f59e0b",
  warningLight: "#fef3c7",
  danger: "#ef4444",
  dangerLight: "#fee2e2",
  background: "#f0f7ff",
  surface: "#f8fbff",
  text: "#0f172a",
  subtext: "#64748b",
  muted: "#94a3b8",
  border: "#dbeafe",
  card: "#ffffff",

  // Sidebar
  sidebarBg: "#1e3a8a",
  sidebarText: "#bfdbfe",
  sidebarActive: "#2563eb",
  sidebarHover: "#1e40af",

  // Specific
  info: "#3b82f6",
  infoLight: "#dbeafe",
} as const;

export type AppColor = keyof typeof Colors;