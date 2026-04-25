import { useCallback, useMemo, useState, useEffect } from "react";
import { collections } from "@/services/firebase/firestore";
import type { Fee } from "@/types";
import { onSnapshot, query, updateDoc, addDoc, deleteDoc, doc } from "firebase/firestore";

export const useFees = () => {
  const [fees, setFees] = useState<Fee[]>([]);

  useEffect(() => {
    const q = query(collections.fees);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Fee[] = [];
      snapshot.forEach((d) => {
        data.push({ id: d.id, ...d.data() } as Fee);
      });
      data.sort((a, b) => a.studentName.localeCompare(b.studentName));
      setFees(data);
    });

    return () => unsubscribe();
  }, []);

  const addFee = useCallback(async (fee: Omit<Fee, "id">) => {
    await addDoc(collections.fees, fee);
  }, []);

  const updateFeeStatus = useCallback(
    async (id: string, status: Fee["status"], paidDate?: string) => {
      const docRef = doc(collections.fees, id);
      const updateData: Partial<Fee> = { status };
      if (status === "paid") {
        updateData.paidDate = paidDate ?? new Date().toISOString().split("T")[0];
      }
      await updateDoc(docRef, updateData);
    },
    []
  );

  const deleteFee = useCallback(async (id: string) => {
    await deleteDoc(doc(collections.fees, id));
  }, []);

  const stats = useMemo(() => {
    const total = fees.length;
    const paid = fees.filter((f) => f.status === "paid").length;
    const pending = fees.filter((f) => f.status === "pending").length;
    const overdue = fees.filter((f) => f.status === "overdue").length;
    const totalCollected = fees
      .filter((f) => f.status === "paid")
      .reduce((sum, f) => sum + f.amount, 0);
    const totalPending = fees
      .filter((f) => f.status !== "paid")
      .reduce((sum, f) => sum + f.amount, 0);
    return { total, paid, pending, overdue, totalCollected, totalPending };
  }, [fees]);

  return { fees, addFee, updateFeeStatus, deleteFee, stats };
};
