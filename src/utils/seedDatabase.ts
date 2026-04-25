import { auth, db } from "@/services/firebase/config";
import { collections } from "@/services/firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {
  seedStudents,
  seedRooms,
  seedComplaints,
  seedFees,
  seedNotices,
  seedMessMenu,
  seedMessFeedback,
} from "@/data/adminSeedData";
import { Roles } from "@/constants/roles";

export const seedDatabase = async () => {
  try {
    console.log("Starting database seed...");

    // 1. Seed Collections directly
    for (const student of seedStudents) {
      await setDoc(doc(collections.users, student.id), student);
    }
    console.log("Seeded Students");

    for (const room of seedRooms) {
      await setDoc(doc(collections.rooms, room.id), room);
    }
    console.log("Seeded Rooms");

    for (const complaint of seedComplaints) {
      await setDoc(doc(collections.complaints, complaint.id), complaint);
    }
    console.log("Seeded Complaints");

    for (const fee of seedFees) {
      await setDoc(doc(collections.fees, fee.id), fee);
    }
    console.log("Seeded Fees");

    for (const notice of seedNotices) {
      await setDoc(doc(collections.notices, notice.id), notice);
    }
    console.log("Seeded Notices");

    for (const menu of seedMessMenu) {
      await setDoc(doc(collections.messMenu, menu.id), menu);
    }
    console.log("Seeded Mess Menu");

    for (const feedback of seedMessFeedback) {
      await setDoc(doc(collections.messFeedback, feedback.id), feedback);
    }
    console.log("Seeded Mess Feedback");

    // 2. Create Auth Accounts for Demo Users (Admin and one Student)
    // We will save current user to re-authenticate if needed, but since this
    // is a manual debug seed, it's fine if they have to log in again.
    const createAuthAccount = async (email: string, role: string, id: string, name: string) => {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, "password123");
        await setDoc(doc(collections.users, cred.user.uid), {
          id: cred.user.uid,
          name,
          email,
          role,
        });
        console.log(`Created Auth Account: ${email}`);
      } catch (err: any) {
        if (err.code === "auth/email-already-in-use") {
          console.log(`Auth account already exists for ${email}`);
        } else {
          console.error(`Failed to create auth for ${email}:`, err);
        }
      }
    };

    await createAuthAccount("admin@hostel.com", Roles.ADMIN, "admin-1", "Hostel Admin");
    await createAuthAccount("student@hostel.com", Roles.STUDENT, "student-1", "Demo Student");

    console.log("Database Seed Complete!");
    alert("Database Seed Complete! You may need to log in again.");
  } catch (error) {
    console.error("Error seeding database:", error);
    alert("Error seeding database. Check console.");
  }
};
