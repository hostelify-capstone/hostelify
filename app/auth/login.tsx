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
import { Roles } from "@/constants/roles";

/* ── Colour Palette (matches reference) ────────────────────── */
const DARK = "#0f172a";
const MUTED = "#64748b";
const BORDER = "#e2e8f0";
const BG = "#ffffff";
const BTN = "#0f172a";
const LINK = "#0f172a";
const STAR = "#fbbf24";

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
      "The complaint system is incredibly responsive. Issues that used to take days are now resolved within hours.",
    name: "Priya Sharma",
    role: "Final Year, B.Tech CSE — Room 204",
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
      "As a warden, the dashboard gives me real-time visibility into every aspect of hostel operations. Highly recommended.",
    name: "Prof. Sunita Verma",
    role: "Warden, Block C",
  },
];

type Role = "student" | "admin";

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── Auto-rotating carousel ─────────────────────────────── */
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

  /* ── Login handler ──────────────────────────────────────── */
  const handleLogin = async () => {
    setError("");
    const userEmail = email.trim().toLowerCase();
    const userPassword = password.trim();

    if (!userEmail || !userPassword) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const user = await signIn(userEmail, userPassword);

      if (role === "admin" && user.role !== Roles.ADMIN) {
        setError("You do not have admin access. Please sign in as Student.");
        setLoading(false);
        return;
      }
      if (role === "student" && user.role === Roles.ADMIN) {
        setError("Admin accounts must use the Admin tab.");
        setLoading(false);
        return;
      }

      router.replace(
        user.role === Roles.ADMIN ? "/admin/dashboard" : "/student/dashboard"
      );
    } catch (err: any) {
      const code = err?.code ?? "";
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(err?.message ?? "Sign-in failed. Please try again.");
      }
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

          {/* Testimonial card */}
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
                  <Text key={s} style={styles.star}>
                    ★
                  </Text>
                ))}
              </View>
            </View>

            {/* Dots */}
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

          {/* Header */}
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>
            Welcome back! Please enter your details.
          </Text>

          {/* Role Toggle */}
          <View style={styles.toggleRow}>
            <Pressable
              style={[
                styles.toggleBtn,
                styles.toggleBtnLeft,
                role === "student" && styles.toggleBtnActive,
              ]}
              onPress={() => {
                setRole("student");
                setError("");
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  role === "student" && styles.toggleTextActive,
                ]}
              >
                Student
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleBtn,
                styles.toggleBtnRight,
                role === "admin" && styles.toggleBtnActive,
              ]}
              onPress={() => {
                setRole("admin");
                setError("");
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  role === "admin" && styles.toggleTextActive,
                ]}
              >
                Admin
              </Text>
            </Pressable>
          </View>

          {/* Error */}
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              style={[styles.input, { marginBottom: 0, paddingRight: 44 }]}
              placeholder="Enter your password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                setError("");
              }}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <Pressable
              style={styles.eyeBtn}
              onPress={() => setShowPassword((v) => !v)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "Hide" : "Show"}</Text>
            </Pressable>
          </View>

          {/* Remember / Forgot */}
          <View style={styles.optionsRow}>
            <View />
            <Pressable>
              <Text style={styles.forgotLink}>Forgot password?</Text>
            </Pressable>
          </View>

          {/* Sign In Button */}
          <Pressable
            style={[styles.signInBtn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.signInText}>Sign in</Text>
            )}
          </Pressable>

          {/* Admin note */}
          {role === "admin" && (
            <View style={styles.adminNote}>
              <Text style={styles.adminNoteText}>
                Admin access is granted by the hostel administrator. Contact
                support if you need access.
              </Text>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push("/auth/register")}>
              <Text style={styles.footerLink}>Sign up for free</Text>
            </Pressable>
          </View>
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

  /* ── Photo Carousel Pane ── */
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
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  dotActive: {
    backgroundColor: "#fff",
    width: 24,
  },

  /* ── Form Pane ── */
  formPane: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
    backgroundColor: BG,
  },
  formCard: {
    width: "100%",
    maxWidth: 380,
  },

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

  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: DARK,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: MUTED,
    marginBottom: 24,
    lineHeight: 20,
  },

  /* Toggle */
  toggleRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#f8fafc",
  },
  toggleBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  toggleBtnLeft: {
    borderRightWidth: 1,
    borderRightColor: BORDER,
  },
  toggleBtnRight: {},
  toggleBtnActive: { backgroundColor: DARK },
  toggleText: { fontSize: 14, fontWeight: "600", color: MUTED },
  toggleTextActive: { color: "#fff" },

  /* Error */
  errorBox: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  errorText: { color: "#dc2626", fontSize: 13, lineHeight: 18 },

  /* Inputs */
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: DARK,
    marginBottom: 6,
  },
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
  passwordWrap: {
    position: "relative",
    marginBottom: 8,
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 13,
  },
  eyeIcon: { fontSize: 12, color: MUTED, fontWeight: "600" },

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  forgotLink: {
    fontSize: 13,
    color: DARK,
    fontWeight: "600",
  },

  /* Button */
  signInBtn: {
    backgroundColor: BTN,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  signInText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  /* Admin note */
  adminNote: {
    backgroundColor: "#fefce8",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  adminNoteText: { color: "#92400e", fontSize: 12, lineHeight: 18 },

  /* Footer */
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  footerText: { fontSize: 14, color: MUTED },
  footerLink: {
    fontSize: 14,
    color: DARK,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});