import emailjs from "@emailjs/browser";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/firebase/config";

const SERVICE_ID  = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID  ?? "";
const TEMPLATE_ID = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY  = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY  ?? "";

const OTP_EXPIRY_MINUTES = 10;

/** Generate a cryptographically random 6-digit OTP */
function generateOTP(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(100000 + (array[0] % 900000));
}

/** Send OTP to email via EmailJS and store hash in Firestore */
export async function sendOTP(email: string, name: string): Promise<void> {
  const otp = generateOTP();
  const expiry = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

  // Store OTP in Firestore (pendingVerifications collection)
  await setDoc(doc(db, "pendingVerifications", email.toLowerCase()), {
    otp,
    expiry,
    email: email.toLowerCase(),
    createdAt: new Date().toISOString(),
  });

  // Send OTP email via EmailJS
  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email: email,
      to_name: name || "Student",
      otp_code: otp,
      expiry_minutes: OTP_EXPIRY_MINUTES,
      app_name: "Hostelify",
    },
    PUBLIC_KEY
  );
}

/** Verify an OTP entered by the user */
export async function verifyOTP(email: string, enteredOTP: string): Promise<boolean> {
  const ref = doc(db, "pendingVerifications", email.toLowerCase());
  const snap = await getDoc(ref);

  if (!snap.exists()) return false;

  const { otp, expiry } = snap.data();

  if (Date.now() > expiry) {
    await deleteDoc(ref); // clean up expired OTP
    return false;
  }

  if (otp !== enteredOTP.trim()) return false;

  await deleteDoc(ref); // OTP used — delete it
  return true;
}
