import { useCallback, useState } from "react";
import { seedNotices } from "@/data/adminSeedData";
import type { Notice } from "@/types";

export const useAdminNotices = () => {
  const [notices, setNotices] = useState<Notice[]>(seedNotices);

  const addNotice = useCallback(
    (notice: Omit<Notice, "id" | "postedAt" | "postedBy">) => {
      const newNotice: Notice = {
        ...notice,
        id: `notice-${Date.now()}`,
        postedAt: new Date().toISOString(),
        postedBy: "admin-1",
        isActive: true,
      };
      setNotices((prev) => [newNotice, ...prev]);
    },
    []
  );

  const updateNotice = useCallback(
    (id: string, data: Partial<Notice>) => {
      setNotices((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...data } : n))
      );
    },
    []
  );

  const deleteNotice = useCallback((id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notices, addNotice, updateNotice, deleteNotice };
};
