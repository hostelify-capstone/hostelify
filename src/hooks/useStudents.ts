import { useCallback, useMemo, useState, useEffect } from "react";
import { collections } from "@/services/firebase/firestore";
import type { AppUser } from "@/types";
import { onSnapshot, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Roles } from "@/constants/roles";

export const useStudents = () => {
  const [students, setStudents] = useState<AppUser[]>([]);

  useEffect(() => {
    const q = query(
      collections.users,
      where("role", "==", Roles.STUDENT)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: AppUser[] = [];
      snapshot.forEach((d) => {
        data.push({ id: d.id, ...d.data() } as AppUser);
      });
      data.sort((a, b) => a.name.localeCompare(b.name));
      setStudents(data);
    });

    return () => unsubscribe();
  }, []);

  const addStudent = useCallback((student: Omit<AppUser, "id">) => {
    // Note: Creating a student directly from admin dashboard is not supported in simple Firebase Auth via client.
    // They must be registered via Firebase Auth first. We'll skip implementation here, but a Cloud Function is ideal.
    console.warn("Adding a student directly requires Firebase Admin SDK or a Cloud Function to create the Auth user.");
  }, []);

  const updateStudent = useCallback(async (id: string, data: Partial<AppUser>) => {
    const docRef = doc(collections.users, id);
    await updateDoc(docRef, data);
  }, []);

  const deleteStudent = useCallback(async (id: string) => {
    // Only deletes profile, not the Auth user.
    const docRef = doc(collections.users, id);
    await deleteDoc(docRef);
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
