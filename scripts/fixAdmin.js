const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function fixAdmin() {
  const uid = "MvIZwdqAOZRjGcVNDCLtMIfQ1AV2";
  const email = "tanushreeat42@gmail.com";

  console.log("\n========================================");
  console.log("  HOSTELIFY — FIXING ADMIN ROLE");
  console.log("========================================\n");

  // Fix the role in Firestore
  await db.collection("users").doc(uid).update({
    role: "admin",
    name: "Hostel Admin",
  });

  console.log(`✅ Fixed! User ${email} is now role: "admin"\n`);

  // Also delete the 16 junk "test" documents created by the old index.tsx
  console.log("🧹 Cleaning up test collection...");
  const testSnap = await db.collection("test").get();
  const batch = db.batch();
  testSnap.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log(`✅ Deleted ${testSnap.size} junk test documents\n`);

  // Verify
  const updated = await db.collection("users").doc(uid).get();
  const d = updated.data();
  console.log("📋 Updated user record:");
  console.log(`   name:  ${d.name}`);
  console.log(`   email: ${d.email}`);
  console.log(`   role:  ${d.role}`);

  console.log("\n========================================");
  console.log("  DONE — Sign in as Admin to test");
  console.log("========================================\n");

  process.exit(0);
}

fixAdmin().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
