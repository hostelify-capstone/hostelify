export const Colors = {
  primary: "#6366f1",
  primaryLight: "#a5b4fc",
  primaryDark: "#4338ca",
  secondary: "#8b5cf6",
  secondaryLight: "#c4b5fd",
  success: "#10b981",
  successLight: "#d1fae5",
  warning: "#f59e0b",
  warningLight: "#fef3c7",
  danger: "#ef4444",
  dangerLight: "#fee2e2",
  background: "#f1f5f9",
  surface: "#f8fafc",
  text: "#0f172a",
  subtext: "#64748b",
  muted: "#94a3b8",
  border: "#e2e8f0",
  card: "#ffffff",

  // Sidebar
  sidebarBg: "#1e1b4b",
  sidebarText: "#c7d2fe",
  sidebarActive: "#6366f1",
  sidebarHover: "#312e81",

  // Specific
  info: "#3b82f6",
  infoLight: "#dbeafe",
} as const;

export type AppColor = keyof typeof Colors;