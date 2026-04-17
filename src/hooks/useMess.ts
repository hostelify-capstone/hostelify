import { useCallback, useMemo, useState, useEffect } from "react";
import { collections } from "@/services/firebase/firestore";
import type { MessMenu, MessFeedback } from "@/types";
import { onSnapshot, query, updateDoc, doc } from "firebase/firestore";

export const useMess = () => {
  const [menu, setMenu] = useState<MessMenu[]>([]);
  const [feedback, setFeedback] = useState<MessFeedback[]>([]);

  useEffect(() => {
    const qMenu = query(collections.messMenu);
    const unsubMenu = onSnapshot(qMenu, (snapshot) => {
      const data: MessMenu[] = [];
      snapshot.forEach((d) => {
        data.push({ id: d.id, ...d.data() } as MessMenu);
      });
      setMenu(data);
    });

    const qFeedback = query(collections.messFeedback);
    const unsubFeedback = onSnapshot(qFeedback, (snapshot) => {
      const data: MessFeedback[] = [];
      snapshot.forEach((d) => {
        data.push({ id: d.id, ...d.data() } as MessFeedback);
      });
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setFeedback(data);
    });

    return () => {
      unsubMenu();
      unsubFeedback();
    };
  }, []);

  const updateMenuItem = useCallback(
    async (id: string, data: Partial<MessMenu>) => {
      const docRef = doc(collections.messMenu, id);
      await updateDoc(docRef, data);
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
