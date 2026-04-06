import { useCallback, useMemo, useState } from "react";
import { seedFees } from "@/data/adminSeedData";
import type { Fee } from "@/types";

export const useFees = () => {
  const [fees, setFees] = useState<Fee[]>(seedFees);

  const updateFeeStatus = useCallback(
    (id: string, status: Fee["status"], paidDate?: string) => {
      setFees((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                status,
                paidDate: status === "paid" ? paidDate ?? new Date().toISOString().split("T")[0] : f.paidDate,
              }
            : f
        )
      );
    },
    []
  );

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

  return { fees, updateFeeStatus, stats };
};
