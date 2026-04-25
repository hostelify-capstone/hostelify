const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const auth = admin.auth();

const ADMIN_UID = "MvIZwdqAOZRjGcVNDCLtMIfQ1AV2";

// All sample student IDs that were seeded
const SAMPLE_STUDENT_EMAILS = [
  "aarav@hostel.com","priya@hostel.com","rohit@hostel.com","sneha@hostel.com",
  "vikram@hostel.com","ananya@hostel.com","karthik@hostel.com","meera@hostel.com",
  "arjun@hostel.com","divya@hostel.com","rahul@hostel.com","pooja@hostel.com",
];
const SAMPLE_STUDENT_FS_IDS = [
  "stu-1","stu-2","stu-3","stu-4","stu-5","stu-6",
  "stu-7","stu-8","stu-9","stu-10","stu-11","stu-12",
];

async function deleteCollection(name) {
  const snap = await db.collection(name).get();
  if (snap.empty) { console.log(`   ⚠️  ${name}: empty, skipping`); return; }
  const batch = db.batch();
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
  console.log(`   🗑️  ${name}: deleted ${snap.size} documents`);
}

async function main() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║   HOSTELIFY — CLEAN PRODUCTION DATABASE   ║");
  console.log("╚══════════════════════════════════════════╝\n");

  // 1. Delete sample student Firestore user documents
  console.log("👤 Removing sample student Firestore profiles...");
  const userBatch = db.batch();
  SAMPLE_STUDENT_FS_IDS.forEach(id => userBatch.delete(db.collection("users").doc(id)));
  await userBatch.commit();
  console.log(`   🗑️  Deleted ${SAMPLE_STUDENT_FS_IDS.length} sample student profiles\n`);

  // 2. Delete sample student Firebase Auth accounts
  console.log("🔐 Removing sample student Auth accounts...");
  for (const email of SAMPLE_STUDENT_EMAILS) {
    try {
      const u = await auth.getUserByEmail(email);
      await auth.deleteUser(u.uid);
      console.log(`   🗑️  Deleted auth: ${email}`);
    } catch (e) {
      console.log(`   ⚠️  Not found: ${email}`);
    }
  }

  // 3. Delete all sample data collections
  console.log("\n📦 Clearing sample data collections...");
  await deleteCollection("complaints");
  await deleteCollection("fees");
  await deleteCollection("notices");
  await deleteCollection("messFeedback");
  await deleteCollection("gatePasses");
  await deleteCollection("test");

  // 4. Reset rooms — clear occupants and set all to available
  console.log("\n🏠 Resetting rooms to empty/available state...");
  const roomsSnap = await db.collection("rooms").get();
  const roomBatch = db.batch();
  roomsSnap.docs.forEach(d => {
    roomBatch.update(d.ref, { occupants: [], status: "available" });
  });
  await roomBatch.commit();
  console.log(`   ✅ Reset ${roomsSnap.size} rooms to empty`);

  // 5. Keep messMenu — it's admin-managed weekly data, not student-specific
  console.log("\n📋 MessMenu kept intact (weekly menu data)\n");

  // 6. Verify final state
  console.log("📊 Final database state:");
  const adminDoc = await db.collection("users").doc(ADMIN_UID).get();
  console.log(`   👑 Admin account: ${adminDoc.exists ? adminDoc.data().email + " (" + adminDoc.data().role + ")" : "MISSING!"}`);
  const cols = ["users","rooms","complaints","fees","notices","messFeedback","gatePasses","messMenu"];
  for (const c of cols) {
    const s = await db.collection(c).get();
    console.log(`   • ${c}: ${s.size} documents`);
  }

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║   CLEANUP COMPLETE ✅                      ║");
  console.log("║                                           ║");
  console.log("║  Database is now clean. Real students     ║");
  console.log("║  can register and their data will be      ║");
  console.log("║  stored properly.                         ║");
  console.log("╚══════════════════════════════════════════╝\n");

  process.exit(0);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
