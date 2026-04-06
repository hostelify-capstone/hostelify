import { useCallback, useMemo, useState } from "react";
import { seedStudents } from "@/data/adminSeedData";
import type { AppUser } from "@/types";

export const useStudents = () => {
  const [students, setStudents] = useState<AppUser[]>(seedStudents);

  const addStudent = useCallback((student: Omit<AppUser, "id">) => {
    const newStudent: AppUser = {
      ...student,
      id: `stu-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
  }, []);

  const updateStudent = useCallback((id: string, data: Partial<AppUser>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  }, []);

  const deleteStudent = useCallback((id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const stats = useMemo(
    () => ({
      total: students.length,
      byCourse: students.reduce((acc, s) => {
        const c = s.course ?? "Unknown";
        acc[c] = (acc[c] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    }),
    [students]
  );

  return { students, addStudent, updateStudent, deleteStudent, stats };
};
