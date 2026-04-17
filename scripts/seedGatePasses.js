const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

const gatePasses = [
  { id: "gp-1",  studentId: "stu-1",  studentName: "Aarav Sharma",  roomNumber: "A-101", destination: "Home - Delhi",     reason: "Family function",           fromDate: "2026-04-10", toDate: "2026-04-12", status: "approved", createdAt: "2026-04-08T10:00:00Z" },
  { id: "gp-2",  studentId: "stu-2",  studentName: "Priya Patel",   roomNumber: "A-102", destination: "Hospital - Mumbai", reason: "Medical appointment",        fromDate: "2026-04-11", toDate: "2026-04-11", status: "approved", createdAt: "2026-04-09T09:00:00Z" },
  { id: "gp-3",  studentId: "stu-3",  studentName: "Rohit Kumar",   roomNumber: "A-103", destination: "Home - Jaipur",     reason: "Sister's wedding",          fromDate: "2026-04-15", toDate: "2026-04-18", status: "pending",  createdAt: "2026-04-10T14:00:00Z" },
  { id: "gp-4",  studentId: "stu-4",  studentName: "Sneha Gupta",   roomNumber: "B-201", destination: "Coaching Centre",   reason: "Competitive exam prep",     fromDate: "2026-04-12", toDate: "2026-04-12", status: "rejected", createdAt: "2026-04-10T11:00:00Z" },
  { id: "gp-5",  studentId: "stu-5",  studentName: "Vikram Singh",  roomNumber: "B-202", destination: "Home - Chandigarh", reason: "Father's birthday",         fromDate: "2026-04-20", toDate: "2026-04-21", status: "pending",  createdAt: "2026-04-11T08:00:00Z" },
  { id: "gp-6",  studentId: "stu-6",  studentName: "Ananya Reddy",  roomNumber: "B-203", destination: "Home - Hyderabad",  reason: "Diwali celebration",        fromDate: "2026-04-19", toDate: "2026-04-22", status: "approved", createdAt: "2026-04-12T10:00:00Z" },
];

async function seed() {
  const batch = db.batch();
  gatePasses.forEach(gp => batch.set(db.collection("gatePasses").doc(gp.id), gp));
  await batch.commit();
  console.log(`✅ Seeded ${gatePasses.length} gate passes`);
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
