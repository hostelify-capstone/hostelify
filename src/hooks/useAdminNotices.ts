import { useCallback, useState, useEffect } from "react";
import { collections } from "@/services/firebase/firestore";
import { auth } from "@/services/firebase/config";
import type { Notice } from "@/types";
import { onSnapshot, query, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export const useAdminNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const q = query(collections.notices);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Notice[] = [];
      snapshot.forEach((d) => {
        data.push({ id: d.id, ...d.data() } as Notice);
      });
      data.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
      setNotices(data);
    });

    return () => unsubscribe();
  }, []);

  const addNotice = useCallback(
    async (notice: Omit<Notice, "id" | "postedAt" | "postedBy">) => {
      const newNotice = {
        ...notice,
        postedAt: new Date().toISOString(),
        postedBy: auth.currentUser?.uid ?? "admin",
        isActive: true,
      };
      await addDoc(collections.notices, newNotice);
    },
    []
  );

  const updateNotice = useCallback(
    async (id: string, data: Partial<Notice>) => {
      const docRef = doc(collections.notices, id);
      await updateDoc(docRef, data);
    },
    []
  );

  const deleteNotice = useCallback(async (id: string) => {
    const docRef = doc(collections.notices, id);
    await deleteDoc(docRef);
  }, []);

  return { notices, addNotice, updateNotice, deleteNotice };
};
