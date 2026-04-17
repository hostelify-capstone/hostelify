import { useState, useEffect } from "react";
import { collections } from "@/services/firebase/firestore";
import type { Notice } from "@/types";
import { onSnapshot, query, where, orderBy } from "firebase/firestore";

export const useNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const q = query(
      collections.notices,
      where("isActive", "==", true)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Notice[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Notice);
      });
      data.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
      setNotices(data);
    });

    return () => unsubscribe();
  }, []);

  return { notices };
};