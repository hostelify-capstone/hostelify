import { useCallback, useMemo, useState } from "react";
import { seedMessMenu, seedMessFeedback } from "@/data/adminSeedData";
import type { MessMenu, MessFeedback } from "@/types";

export const useMess = () => {
  const [menu, setMenu] = useState<MessMenu[]>(seedMessMenu);
  const [feedback] = useState<MessFeedback[]>(seedMessFeedback);

  const updateMenuItem = useCallback(
    (id: string, data: Partial<MessMenu>) => {
      setMenu((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
    },
    []
  );

  const feedbackStats = useMemo(() => {
    const totalFeedback = feedback.length;
    const avgRating =
      totalFeedback > 0
        ? feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
        : 0;

    const byMeal = feedback.reduce(
      (acc, f) => {
        if (!acc[f.meal]) {
          acc[f.meal] = { count: 0, totalRating: 0 };
        }
        acc[f.meal].count += 1;
        acc[f.meal].totalRating += f.rating;
        return acc;
      },
      {} as Record<string, { count: number; totalRating: number }>
    );

    const mealAverages = Object.entries(byMeal).reduce(
      (acc, [meal, data]) => {
        acc[meal] = Math.round((data.totalRating / data.count) * 10) / 10;
        return acc;
      },
      {} as Record<string, number>
    );

    const ratingDistribution = [1, 2, 3, 4, 5].map((r) => ({
      rating: r,
      count: feedback.filter((f) => f.rating === r).length,
    }));

    return {
      totalFeedback,
      avgRating: Math.round(avgRating * 10) / 10,
      mealAverages,
      ratingDistribution,
    };
  }, [feedback]);

  return { menu, feedback, updateMenuItem, feedbackStats };
};
