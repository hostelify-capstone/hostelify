const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function checkAndFix() {
  console.log("\n========================================");
  console.log("  HOSTELIFY — FIRESTORE DATABASE CHECK");
  console.log("========================================\n");

  // 1. List all collections
  const collections = await db.listCollections();
  console.log("📁 Collections in your Firestore:");
  if (collections.length === 0) {
    console.log("   ⚠️  NO COLLECTIONS FOUND — database is empty!\n");
  } else {
    for (const col of collections) {
      const snap = await db.collection(col.id).get();
      console.log(`   • ${col.id}  (${snap.size} documents)`);
    }
  }

  // 2. Check users collection
  console.log("\n👥 Users in Firestore:");
  const usersSnap = await db.collection("users").get();
  if (usersSnap.empty) {
    console.log("   ⚠️  No users found in Firestore users collection!");
  } else {
    usersSnap.forEach((doc) => {
      const d = doc.data();
      console.log(`   UID: ${doc.id}`);
      console.log(`     name:  ${d.name ?? "(missing)"}`);
      console.log(`     email: ${d.email ?? "(missing)"}`);
      console.log(`     role:  ${d.role ?? "(MISSING — this is the bug!)"}`);
      console.log("");
    });
  }

  // 3. Check Firebase Auth users
  console.log("🔐 Firebase Auth users:");
  try {
    const authUsers = await admin.auth().listUsers(100);
    if (authUsers.users.length === 0) {
      console.log("   ⚠️  No Auth users found!");
    } else {
      for (const user of authUsers.users) {
        const fsDoc = await db.collection("users").doc(user.uid).get();
        const role = fsDoc.exists ? fsDoc.data().role : "❌ NO FIRESTORE DOC";
        console.log(`   • ${user.email}  →  role: ${role}  (uid: ${user.uid})`);
      }
    }
  } catch (e) {
    console.log("   Error listing auth users:", e.message);
  }

  console.log("\n========================================");
  console.log("  CHECK COMPLETE");
  console.log("========================================\n");

  process.exit(0);
}

checkAndFix().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
