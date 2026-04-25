import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { sendOTP, verifyOTP } from "@/services/otp/otpService";

/* ── Colour Palette ────────────────────────────────────────── */
const DARK = "#0f172a";
const MUTED = "#64748b";
const BORDER = "#e2e8f0";
const BG = "#ffffff";
const BTN = "#0f172a";
const STAR = "#fbbf24";
const ERROR_COLOR = "#dc2626";
const SUCCESS_COLOR = "#16a34a";

/* ── Slides data ───────────────────────────────────────────── */
const SLIDES = [
  {
    image: require("../../assets/hostel_slide_1.png"),
    quote:
      "Hostelify has transformed the way we manage our hostel. Everything — from room allocation to fee tracking — is seamless now.",
    name: "Dr. Rajeev Menon",
    role: "Chief Warden, Block A",
  },
  {
    image: require("../../assets/hostel_slide_2.png"),
    quote:
      "The common areas are well-managed and the feedback system ensures our voices are heard. Best hostel experience ever.",
    name: "Sneha Kapoor",
    role: "Third Year, B.Tech IT — Room 306",
  },
  {
    image: require("../../assets/hostel_slide_3.png"),
    quote:
      "I love how I can check the mess menu, pay my fees, and apply for gate passes all in one place.",
    name: "Arjun Patel",
    role: "Second Year, B.Tech ECE — Room 112",
  },
  {
    image: require("../../assets/hostel_slide_4.png"),
    quote:
      "The mess management module alone has saved us hours of manual work every week. A must-have for any hostel.",
    name: "Prof. Sunita Verma",
    role: "Warden, Block C",
  },
];

type Step = "details" | "otp" | "done";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  // Form fields
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // OTP step
  const [step, setStep] = useState<Step>("details");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ── Carousel ────────────────────────────────────────────── */
  const [activeSlide, setActiveSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goToSlide = (idx: number) => {
    setActiveSlide(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
  };

  /* ── Step 1: Validate & send OTP ─────────────────────────── */
  const handleSendOTP = async () => {
    setError("");
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await sendOTP(email.trim(), name.trim());
      setStep("otp");
      setSuccess(`A 6-digit OTP has been sent to ${email.trim()}`);
    } catch (err: any) {
      setError(err?.message ?? "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: Verify OTP & create account ─────────────────── */
  const handleVerifyAndRegister = async () => {
    setError("");
    setSuccess("");
    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const isValid = await verifyOTP(email.trim(), otp.trim());
      if (!isValid) {
        setError("Invalid or expired OTP. Please try again or resend.");
        setLoading(false);
        return;
      }

      await register(
        name.trim(),
        email.trim(),
        password,
        phone.trim() || undefined
      );

      setStep("done");
      setSuccess("Account created! Redirecting to your dashboard...");
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in.");
      } else {
        setError(err?.message ?? "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend OTP ──────────────────────────────────────────── */
  const handleResend = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await sendOTP(email.trim(), name.trim());
      setSuccess("A new OTP has been sent to your email.");
    } catch (err: any) {
      setError(err?.message ?? "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const currentSlide = SLIDES[activeSlide];

  return (
    <View style={styles.root}>
      {/* ── Right: Photo Carousel ── */}
      {isWide && (
        <View style={styles.photoPane}>
          {SLIDES.map((slide, idx) => (
            <Image
              key={idx}
              source={slide.image}
              style={[
                styles.photo,
                { opacity: idx === activeSlide ? 1 : 0 },
              ]}
              resizeMode="cover"
            />
          ))}
          <View style={styles.photoOverlay} />

          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              &ldquo;{currentSlide.quote}&rdquo;
            </Text>
            <View style={styles.quoteFooter}>
              <View>
                <Text style={styles.quoteName}>{currentSlide.name}</Text>
                <Text style={styles.quoteRole}>{currentSlide.role}</Text>
              </View>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Text key={s} style={styles.star}>★</Text>
                ))}
              </View>
            </View>
            <View style={styles.dotsRow}>
              {SLIDES.map((_, idx) => (
                <Pressable key={idx} onPress={() => goToSlide(idx)}>
                  <View
                    style={[
                      styles.dot,
                      idx === activeSlide && styles.dotActive,
                    ]}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* ── Left: Form Pane ── */}
      <ScrollView
        contentContainerStyle={styles.formPane}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          {/* Branding */}
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandIconText}>H</Text>
            </View>
            <Text style={styles.brandName}>Hostelify</Text>
          </View>

          {/* ────── Step 1: Details ────── */}
          {step === "details" && (
            <>
              <Text style={styles.heading}>Create account</Text>
              <Text style={styles.subheading}>
                Sign up as a student to get started.
              </Text>

              {!!error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Full Name */}
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Priya Sharma"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={(v) => {
                  setName(v);
                  setError("");
                }}
              />

              {/* Student ID */}
              <Text style={styles.label}>Student / Enrollment ID</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. STU2024001"
                placeholderTextColor="#94a3b8"
                value={studentId}
                onChangeText={setStudentId}
                autoCapitalize="characters"
              />

              {/* Email */}
              <Text style={styles.label}>Email address *</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Phone */}
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 98765 43210"
                placeholderTextColor="#94a3b8"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              {/* Password */}
              <Text style={styles.label}>Password *</Text>
              <View style={styles.passwordWrap}>
                <TextInput
                  style={[styles.input, { marginBottom: 0, paddingRight: 44 }]}
                  placeholder="Min. 6 characters"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    setError("");
                  }}
                  secureTextEntry={!showPass}
                />
                <Pressable
                  style={styles.eyeBtn}
                  onPress={() => setShowPass((v) => !v)}
                >
                  <Text style={styles.eyeIcon}>
                    {showPass ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>
              <View style={{ height: 16 }} />

              {/* Confirm Password */}
              <Text style={styles.label}>Confirm Password *</Text>
              <View style={styles.passwordWrap}>
                <TextInput
                  style={[styles.input, { marginBottom: 0, paddingRight: 44 }]}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#94a3b8"
                  value={confirmPassword}
                  onChangeText={(v) => {
                    setConfirmPassword(v);
                    setError("");
                  }}
                  secureTextEntry={!showConfirm}
                />
                <Pressable
                  style={styles.eyeBtn}
                  onPress={() => setShowConfirm((v) => !v)}
                >
                  <Text style={styles.eyeIcon}>
                    {showConfirm ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>
              <View style={{ height: 8 }} />

              <Pressable
                style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                onPress={handleSendOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.primaryBtnText}>
                    Send Verification OTP
                  </Text>
                )}
              </Pressable>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>
                  Already have an account?{" "}
                </Text>
                <Pressable onPress={() => router.replace("/auth/login")}>
                  <Text style={styles.footerLink}>Sign in</Text>
                </Pressable>
              </View>
            </>
          )}

          {/* ────── Step 2: OTP Verification ────── */}
          {step === "otp" && (
            <>
              <Text style={styles.heading}>Verify your email</Text>
              <Text style={styles.subheading}>
                We sent a 6-digit OTP to{" "}
                <Text style={{ fontWeight: "700", color: DARK }}>{email}</Text>.
                {"\n"}Enter it below to complete registration.
              </Text>

              {!!error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              {!!success && (
                <View style={styles.successBox}>
                  <Text style={styles.successText}>{success}</Text>
                </View>
              )}

              <Text style={styles.label}>OTP Code</Text>
              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="------"
                placeholderTextColor="#94a3b8"
                value={otp}
                onChangeText={(v) => {
                  setOtp(v.replace(/\D/g, "").slice(0, 6));
                  setError("");
                }}
                keyboardType="number-pad"
                maxLength={6}
              />

              <Pressable
                style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                onPress={handleVerifyAndRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.primaryBtnText}>
                    Verify & Create Account
                  </Text>
                )}
              </Pressable>

              <View style={styles.resendRow}>
                <Text style={styles.footerText}>Didn't receive it? </Text>
                <Pressable onPress={handleResend} disabled={loading}>
                  <Text style={styles.footerLink}>Resend OTP</Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.backBtn}
                onPress={() => {
                  setStep("details");
                  setError("");
                  setSuccess("");
                  setOtp("");
                }}
              >
                <Text style={styles.backBtnText}>Go back</Text>
              </Pressable>
            </>
          )}

          {/* ────── Step 3: Done ────── */}
          {step === "done" && (
            <View style={styles.doneContainer}>
              <View style={styles.doneIconCircle}>
                <Text style={styles.doneCheck}>✓</Text>
              </View>
              <Text style={styles.heading}>You're all set!</Text>
              <Text style={styles.subheading}>
                Your Hostelify account has been created successfully. You'll be
                redirected to your dashboard shortly.
              </Text>
              <ActivityIndicator
                color={DARK}
                size="large"
                style={{ marginTop: 20 }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row-reverse",
    backgroundColor: BG,
  },

  /* Photo carousel */
  photoPane: {
    width: "50%",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#1e293b",
  },
  photo: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
  },
  quoteCard: {
    position: "absolute",
    bottom: 40,
    left: 32,
    right: 32,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    padding: 24,
  },
  quoteText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 24,
    fontStyle: "italic",
    marginBottom: 16,
  },
  quoteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  quoteName: { color: "#fff", fontWeight: "700", fontSize: 14 },
  quoteRole: { color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2 },
  starsRow: { flexDirection: "row", gap: 2 },
  star: { color: STAR, fontSize: 14 },
  dotsRow: { flexDirection: "row", gap: 8, justifyContent: "center" },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  dotActive: { backgroundColor: "#fff", width: 24 },

  /* Form pane */
  formPane: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 32,
    backgroundColor: BG,
  },
  formCard: { width: "100%", maxWidth: 380 },

  /* Branding */
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: DARK,
    alignItems: "center",
    justifyContent: "center",
  },
  brandIconText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  brandName: {
    fontSize: 20,
    fontWeight: "800",
    color: DARK,
    letterSpacing: 0.3,
  },

  heading: { fontSize: 26, fontWeight: "800", color: DARK, marginBottom: 6 },
  subheading: {
    fontSize: 13,
    color: MUTED,
    marginBottom: 20,
    lineHeight: 20,
  },

  /* Alerts */
  errorBox: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  errorText: { color: ERROR_COLOR, fontSize: 13, lineHeight: 18 },
  successBox: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  successText: { color: SUCCESS_COLOR, fontSize: 13, lineHeight: 18 },

  /* Inputs */
  label: { fontSize: 13, fontWeight: "600", color: DARK, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: DARK,
    backgroundColor: BG,
    marginBottom: 16,
  },
  otpInput: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 8,
    textAlign: "center",
  },
  passwordWrap: { position: "relative" },
  eyeBtn: { position: "absolute", right: 14, top: 13 },
  eyeIcon: { fontSize: 12, color: MUTED, fontWeight: "600" },

  /* Buttons */
  primaryBtn: {
    backgroundColor: BTN,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 4,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  backBtn: { alignItems: "center", marginTop: 4 },
  backBtnText: { color: MUTED, fontSize: 14, fontWeight: "600" },

  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },

  /* Footer */
  footerRow: { flexDirection: "row", justifyContent: "center" },
  footerText: { fontSize: 14, color: MUTED },
  footerLink: {
    fontSize: 14,
    color: DARK,
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  /* Done */
  doneContainer: { alignItems: "center", paddingVertical: 32 },
  doneIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  doneCheck: { color: "#fff", fontSize: 28, fontWeight: "800" },
});