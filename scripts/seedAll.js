const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();
const auth = admin.auth();

// ── Seed Data ─────────────────────────────────────────────────────────────────

const students = [
  { id: "stu-1",  name: "Aarav Sharma",  email: "aarav@hostel.com",   role: "student", roomNumber: "A-101", phone: "+91 98001 00001", enrollmentNo: "EN2024001", course: "B.Tech CSE", year: 2, joinDate: "2024-07-15" },
  { id: "stu-2",  name: "Priya Patel",   email: "priya@hostel.com",   role: "student", roomNumber: "A-102", phone: "+91 98001 00002", enrollmentNo: "EN2024002", course: "B.Tech ECE", year: 2, joinDate: "2024-07-15" },
  { id: "stu-3",  name: "Rohit Kumar",   email: "rohit@hostel.com",   role: "student", roomNumber: "A-103", phone: "+91 98001 00003", enrollmentNo: "EN2024003", course: "B.Tech ME",  year: 3, joinDate: "2023-07-10" },
  { id: "stu-4",  name: "Sneha Gupta",   email: "sneha@hostel.com",   role: "student", roomNumber: "B-201", phone: "+91 98001 00004", enrollmentNo: "EN2024004", course: "B.Tech IT",  year: 1, joinDate: "2025-07-20" },
  { id: "stu-5",  name: "Vikram Singh",  email: "vikram@hostel.com",  role: "student", roomNumber: "B-202", phone: "+91 98001 00005", enrollmentNo: "EN2024005", course: "B.Tech CSE", year: 4, joinDate: "2022-07-12" },
  { id: "stu-6",  name: "Ananya Reddy",  email: "ananya@hostel.com",  role: "student", roomNumber: "B-203", phone: "+91 98001 00006", enrollmentNo: "EN2024006", course: "BCA",        year: 2, joinDate: "2024-07-15" },
  { id: "stu-7",  name: "Karthik Nair",  email: "karthik@hostel.com", role: "student", roomNumber: "C-301", phone: "+91 98001 00007", enrollmentNo: "EN2024007", course: "B.Tech EE",  year: 3, joinDate: "2023-07-10" },
  { id: "stu-8",  name: "Meera Joshi",   email: "meera@hostel.com",   role: "student", roomNumber: "C-302", phone: "+91 98001 00008", enrollmentNo: "EN2024008", course: "B.Tech CSE", year: 1, joinDate: "2025-07-20" },
  { id: "stu-9",  name: "Arjun Mehta",   email: "arjun@hostel.com",   role: "student", roomNumber: "C-303", phone: "+91 98001 00009", enrollmentNo: "EN2024009", course: "MBA",        year: 1, joinDate: "2025-07-20" },
  { id: "stu-10", name: "Divya Chopra",  email: "divya@hostel.com",   role: "student", roomNumber: "A-104", phone: "+91 98001 00010", enrollmentNo: "EN2024010", course: "B.Tech CE",  year: 2, joinDate: "2024-07-15" },
  { id: "stu-11", name: "Rahul Verma",   email: "rahul@hostel.com",   role: "student", roomNumber: "A-201", phone: "+91 98001 00011", enrollmentNo: "EN2024011", course: "B.Tech CSE", year: 3, joinDate: "2023-07-10" },
  { id: "stu-12", name: "Pooja Bhatt",   email: "pooja@hostel.com",   role: "student", roomNumber: "A-202", phone: "+91 98001 00012", enrollmentNo: "EN2024012", course: "B.Tech IT",  year: 2, joinDate: "2024-07-15" },
];

const rooms = [
  { id: "room-1",  roomNumber: "A-101", block: "A", floor: 1, capacity: 3, occupants: ["stu-1","stu-2"],        status: "occupied" },
  { id: "room-2",  roomNumber: "A-102", block: "A", floor: 1, capacity: 3, occupants: ["stu-3"],               status: "occupied" },
  { id: "room-3",  roomNumber: "A-103", block: "A", floor: 1, capacity: 3, occupants: [],                      status: "available" },
  { id: "room-4",  roomNumber: "A-104", block: "A", floor: 1, capacity: 2, occupants: ["stu-10"],              status: "occupied" },
  { id: "room-5",  roomNumber: "A-201", block: "A", floor: 2, capacity: 3, occupants: ["stu-11","stu-12"],      status: "occupied" },
  { id: "room-6",  roomNumber: "A-202", block: "A", floor: 2, capacity: 3, occupants: [],                      status: "maintenance" },
  { id: "room-7",  roomNumber: "B-201", block: "B", floor: 2, capacity: 2, occupants: ["stu-4"],               status: "occupied" },
  { id: "room-8",  roomNumber: "B-202", block: "B", floor: 2, capacity: 2, occupants: ["stu-5"],               status: "occupied" },
  { id: "room-9",  roomNumber: "B-203", block: "B", floor: 2, capacity: 3, occupants: ["stu-6"],               status: "occupied" },
  { id: "room-10", roomNumber: "B-301", block: "B", floor: 3, capacity: 3, occupants: [],                      status: "available" },
  { id: "room-11", roomNumber: "C-301", block: "C", floor: 3, capacity: 2, occupants: ["stu-7"],               status: "occupied" },
  { id: "room-12", roomNumber: "C-302", block: "C", floor: 3, capacity: 2, occupants: ["stu-8","stu-9"],        status: "occupied" },
  { id: "room-13", roomNumber: "C-303", block: "C", floor: 3, capacity: 3, occupants: [],                      status: "available" },
  { id: "room-14", roomNumber: "C-401", block: "C", floor: 4, capacity: 2, occupants: [],                      status: "available" },
  { id: "room-15", roomNumber: "C-402", block: "C", floor: 4, capacity: 3, occupants: [],                      status: "maintenance" },
  { id: "room-16", roomNumber: "D-101", block: "D", floor: 1, capacity: 2, occupants: [],                      status: "available" },
];

const complaints = [
  { id: "cmp-1", title: "No water supply in washroom",    description: "Water has not been available since yesterday morning.", category: "Water",       status: "open",        priority: "critical", createdAt: "2026-04-05T08:30:00Z", createdBy: "stu-1",  studentName: "Aarav Sharma",  roomNumber: "A-101" },
  { id: "cmp-2", title: "Mess food quality issue",        description: "Food was cold and undercooked during dinner.",           category: "Mess",        status: "in-progress", priority: "high",     createdAt: "2026-04-04T19:15:00Z", createdBy: "stu-2",  studentName: "Priya Patel",   roomNumber: "A-102" },
  { id: "cmp-3", title: "Broken window in room",          description: "The window glass is cracked and poses a safety hazard.", category: "Maintenance", status: "open",        priority: "high",     createdAt: "2026-04-04T14:00:00Z", createdBy: "stu-3",  studentName: "Rohit Kumar",   roomNumber: "A-103" },
  { id: "cmp-4", title: "WiFi not working on 2nd floor",  description: "Internet connectivity has been down for two days.",      category: "WiFi",        status: "in-progress", priority: "medium",   createdAt: "2026-04-03T10:45:00Z", createdBy: "stu-4",  studentName: "Sneha Gupta",   roomNumber: "B-201" },
  { id: "cmp-5", title: "Electricity fluctuation",        description: "Frequent power cuts and voltage fluctuations in Block B.", category: "Electricity", status: "open",       priority: "critical", createdAt: "2026-04-03T07:20:00Z", createdBy: "stu-5",  studentName: "Vikram Singh",  roomNumber: "B-202" },
  { id: "cmp-6", title: "Bathroom drain blocked",         description: "Drain is blocked and water is overflowing.",             category: "Maintenance", status: "resolved",    priority: "high",     createdAt: "2026-04-01T16:30:00Z", createdBy: "stu-6",  studentName: "Ananya Reddy",  roomNumber: "B-203" },
  { id: "cmp-7", title: "Room light not working",         description: "The tube light in my room has stopped working.",         category: "Electricity", status: "resolved",    priority: "low",      createdAt: "2026-03-30T20:10:00Z", createdBy: "stu-7",  studentName: "Karthik Nair",  roomNumber: "C-301" },
  { id: "cmp-8", title: "Pest control needed",            description: "Cockroach and ant infestation in room.",                 category: "Maintenance", status: "open",        priority: "medium",   createdAt: "2026-04-02T11:00:00Z", createdBy: "stu-8",  studentName: "Meera Joshi",   roomNumber: "C-302" },
];

const fees = [
  { id: "fee-1",  studentId: "stu-1",  studentName: "Aarav Sharma",  roomNumber: "A-101", amount: 45000, dueDate: "2026-04-15", paidDate: "2026-04-01", status: "paid",    semester: "Spring 2026" },
  { id: "fee-2",  studentId: "stu-2",  studentName: "Priya Patel",   roomNumber: "A-102", amount: 45000, dueDate: "2026-04-15",                         status: "pending", semester: "Spring 2026" },
  { id: "fee-3",  studentId: "stu-3",  studentName: "Rohit Kumar",   roomNumber: "A-103", amount: 45000, dueDate: "2026-03-15",                         status: "overdue", semester: "Spring 2026" },
  { id: "fee-4",  studentId: "stu-4",  studentName: "Sneha Gupta",   roomNumber: "B-201", amount: 42000, dueDate: "2026-04-15", paidDate: "2026-03-28", status: "paid",    semester: "Spring 2026" },
  { id: "fee-5",  studentId: "stu-5",  studentName: "Vikram Singh",  roomNumber: "B-202", amount: 42000, dueDate: "2026-04-15",                         status: "pending", semester: "Spring 2026" },
  { id: "fee-6",  studentId: "stu-6",  studentName: "Ananya Reddy",  roomNumber: "B-203", amount: 45000, dueDate: "2026-04-15", paidDate: "2026-04-05", status: "paid",    semester: "Spring 2026" },
  { id: "fee-7",  studentId: "stu-7",  studentName: "Karthik Nair",  roomNumber: "C-301", amount: 42000, dueDate: "2026-03-15",                         status: "overdue", semester: "Spring 2026" },
  { id: "fee-8",  studentId: "stu-8",  studentName: "Meera Joshi",   roomNumber: "C-302", amount: 42000, dueDate: "2026-04-15", paidDate: "2026-04-02", status: "paid",    semester: "Spring 2026" },
  { id: "fee-9",  studentId: "stu-9",  studentName: "Arjun Mehta",   roomNumber: "C-303", amount: 45000, dueDate: "2026-04-15",                         status: "pending", semester: "Spring 2026" },
  { id: "fee-10", studentId: "stu-10", studentName: "Divya Chopra",  roomNumber: "A-104", amount: 42000, dueDate: "2026-04-15", paidDate: "2026-04-06", status: "paid",    semester: "Spring 2026" },
  { id: "fee-11", studentId: "stu-11", studentName: "Rahul Verma",   roomNumber: "A-201", amount: 45000, dueDate: "2026-03-15",                         status: "overdue", semester: "Spring 2026" },
  { id: "fee-12", studentId: "stu-12", studentName: "Pooja Bhatt",   roomNumber: "A-202", amount: 45000, dueDate: "2026-04-15",                         status: "pending", semester: "Spring 2026" },
];

const notices = [
  { id: "notice-1", title: "Water Tank Cleaning",    content: "Water supply will be unavailable from 10 AM to 1 PM on Sunday for routine tank cleaning.",              postedAt: "2026-04-06T09:00:00Z", postedBy: "admin-1", category: "Maintenance", isActive: true },
  { id: "notice-2", title: "Hostel Curfew Reminder", content: "All students must return to hostel by 9:30 PM. Gate pass is mandatory for late entry.",                 postedAt: "2026-04-05T14:00:00Z", postedBy: "admin-1", category: "General",     isActive: true },
  { id: "notice-3", title: "Semester Fee Due Date",  content: "Last date for hostel fee payment is April 15, 2026. Late payment will attract a fine of ₹500 per day.", postedAt: "2026-04-03T10:00:00Z", postedBy: "admin-1", category: "Fee",         isActive: true },
  { id: "notice-4", title: "Annual Sports Meet",     content: "Hostel sports tournament starts from April 20th. Register for cricket, badminton, volleyball, and chess.", postedAt: "2026-04-01T08:30:00Z", postedBy: "admin-1", category: "Events",      isActive: true },
  { id: "notice-5", title: "Mess Menu Update",       content: "New mess menu has been updated for April. Special weekend breakfast items added.",                       postedAt: "2026-03-30T12:00:00Z", postedBy: "admin-1", category: "Mess",        isActive: false },
];

const messMenu = [
  { id: "menu-1", day: "Monday",    breakfast: "Poha, Tea, Banana",              lunch: "Rice, Dal Fry, Mix Veg, Roti, Salad",          snacks: "Samosa, Tea",          dinner: "Roti, Paneer Butter Masala, Rice, Dal" },
  { id: "menu-2", day: "Tuesday",   breakfast: "Idli, Sambhar, Chutney, Coffee", lunch: "Rice, Rajma, Aloo Gobi, Roti, Raita",          snacks: "Bread Pakora, Tea",    dinner: "Roti, Chole, Rice, Salad, Gulab Jamun" },
  { id: "menu-3", day: "Wednesday", breakfast: "Paratha, Curd, Pickle, Tea",     lunch: "Rice, Dal Tadka, Bhindi Fry, Roti",            snacks: "Veg Sandwich, Juice",  dinner: "Roti, Egg Curry / Paneer, Rice, Dal" },
  { id: "menu-4", day: "Thursday",  breakfast: "Upma, Vada, Chutney, Coffee",    lunch: "Rice, Chana Dal, Cabbage Sabji, Roti",         snacks: "Momos, Tea",           dinner: "Roti, Malai Kofta, Rice, Soup" },
  { id: "menu-5", day: "Friday",    breakfast: "Chole Bhature, Lassi",           lunch: "Biryani, Raita, Salad, Papad",                 snacks: "Spring Rolls, Coffee", dinner: "Roti, Mixed Dal, Aloo Matar, Rice" },
  { id: "menu-6", day: "Saturday",  breakfast: "Dosa, Sambhar, Chutney, Tea",    lunch: "Rice, Kadhi Pakora, Baingan Bharta, Roti",     snacks: "Pav Bhaji, Juice",     dinner: "Roti, Butter Chicken / Paneer Tikka, Rice, Ice Cream" },
  { id: "menu-7", day: "Sunday",    breakfast: "Aloo Paratha, Curd, Achaar, Juice", lunch: "Pulao, Dal Makhani, Mix Veg, Roti, Sweet", snacks: "Maggi, Tea",           dinner: "Roti, Shahi Paneer, Rice, Kheer" },
];

const messFeedback = [
  { id: "fb-1",  studentName: "Aarav Sharma",  rating: 4, comment: "Lunch was great today, loved the biryani!",        meal: "lunch",     date: "2026-04-06" },
  { id: "fb-2",  studentName: "Priya Patel",   rating: 2, comment: "Breakfast was served cold. Needs improvement.",    meal: "breakfast", date: "2026-04-06" },
  { id: "fb-3",  studentName: "Rohit Kumar",   rating: 5, comment: "Excellent dinner! Best paneer masala so far.",     meal: "dinner",    date: "2026-04-05" },
  { id: "fb-4",  studentName: "Sneha Gupta",   rating: 3, comment: "Average snacks. Could add more variety.",          meal: "snacks",    date: "2026-04-05" },
  { id: "fb-5",  studentName: "Vikram Singh",  rating: 1, comment: "Found hair in the dal. Very unhygienic!",          meal: "lunch",     date: "2026-04-04" },
  { id: "fb-6",  studentName: "Ananya Reddy",  rating: 4, comment: "Loved the weekend special breakfast.",             meal: "breakfast", date: "2026-04-05" },
  { id: "fb-7",  studentName: "Karthik Nair",  rating: 3, comment: "Dinner portions are too small for the price.",     meal: "dinner",    date: "2026-04-04" },
  { id: "fb-8",  studentName: "Meera Joshi",   rating: 5, comment: "Snacks are always on point! Love the momos.",      meal: "snacks",    date: "2026-04-03" },
  { id: "fb-9",  studentName: "Arjun Mehta",   rating: 4, comment: "Good food quality overall. Keep it up!",           meal: "lunch",     date: "2026-04-03" },
  { id: "fb-10", studentName: "Divya Chopra",  rating: 2, comment: "Too oily food in dinner. Health concern.",         meal: "dinner",    date: "2026-04-03" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function seedCollection(name, items) {
  const batch = db.batch();
  items.forEach(item => {
    batch.set(db.collection(name).doc(item.id), item);
  });
  await batch.commit();
  console.log(`   ✅ ${name}: ${items.length} documents written`);
}

async function createStudentAuthAccount(student) {
  try {
    await auth.createUser({ uid: student.id, email: student.email, password: "student123", displayName: student.name });
    console.log(`   ✅ Auth created: ${student.email}`);
  } catch (e) {
    if (e.code === "auth/uid-already-exists" || e.code === "auth/email-already-exists") {
      console.log(`   ⚠️  Already exists: ${student.email}`);
    } else {
      console.log(`   ❌ Failed: ${student.email} — ${e.message}`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║   HOSTELIFY — FULL DATABASE SEED          ║");
  console.log("╚══════════════════════════════════════════╝\n");

  console.log("📦 Seeding Firestore collections...");
  await seedCollection("users",        students);
  await seedCollection("rooms",        rooms);
  await seedCollection("complaints",   complaints);
  await seedCollection("fees",         fees);
  await seedCollection("notices",      notices);
  await seedCollection("messMenu",     messMenu);
  await seedCollection("messFeedback", messFeedback);

  console.log("\n🔐 Creating Firebase Auth accounts for students...");
  console.log("   (Default password for all: student123)\n");
  for (const student of students) {
    await createStudentAuthAccount(student);
  }

  console.log("\n📋 Final database state:");
  const cols = await db.listCollections();
  for (const col of cols) {
    const snap = await db.collection(col.id).get();
    console.log(`   • ${col.id}: ${snap.size} documents`);
  }

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║   SEED COMPLETE ✅                         ║");
  console.log("╠══════════════════════════════════════════╣");
  console.log("║  Admin login:                             ║");
  console.log("║    Email:    tanushreeat42@gmail.com      ║");
  console.log("║    Password: (your password)              ║");
  console.log("║    Role:     Admin                        ║");
  console.log("║                                           ║");
  console.log("║  Student login (any of 12 students):      ║");
  console.log("║    Email:    aarav@hostel.com             ║");
  console.log("║    Password: student123                   ║");
  console.log("║    Role:     Student                      ║");
  console.log("╚══════════════════════════════════════════╝\n");

  process.exit(0);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
