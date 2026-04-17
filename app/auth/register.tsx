import React, { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { sendOTP, verifyOTP } from "@/services/otp/otpService";
import { validatePassword, getPasswordStrength } from "@/utils/passwordValidator";

type Step = "email" | "otp" | "details";

const STRENGTH_COLORS = { weak: Colors.danger, medium: Colors.warning, strong: Colors.success };

export default function RegisterScreen() {
  const { register } = useAuth();

  // Step
  const [step, setStep] = useState<Step>("email");

  // Step 1 — email
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Step 2 — OTP
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");

  // Step 3 — details
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const pwValidation = validatePassword(password);
  const pwStrength = getPasswordStrength(password);

  // ── Step 1: Send OTP ─────────────────────────────────────────────────────
  const handleSendOTP = async () => {
    setError("");
    if (!name.trim()) { setError("Please enter your full name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return; }

    try {
      setLoading(true);
      await sendOTP(email.trim(), name.trim());
      setStep("otp");
      startResendCooldown();
    } catch (e: any) {
      setError("Failed to send OTP. Check your email and try again.\n" + (e?.text || e?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────────────────
  const handleVerifyOTP = async () => {
    setOtpError("");
    if (otpInput.length !== 6) { setOtpError("Enter the 6-digit code sent to your email."); return; }

    try {
      setLoading(true);
      const valid = await verifyOTP(email.trim(), otpInput.trim());
      if (!valid) {
        setOtpError("Incorrect or expired OTP. Please try again.");
        return;
      }
      setStep("details");
    } catch (e) {
      setOtpError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP cooldown ───────────────────────────────────────────────────
  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      setLoading(true);
      await sendOTP(email.trim(), name.trim());
      setOtpInput(""); setOtpError("");
      startResendCooldown();
    } catch { setOtpError("Failed to resend. Try again."); }
    finally { setLoading(false); }
  };

  // ── Step 3: Create Account ───────────────────────────────────────────────
  const handleCreateAccount = async () => {
    setError("");
    if (!pwValidation.isValid) {
      setError("Password does not meet requirements:\n" + pwValidation.errors.join(", "));
      return;
    }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password, phone.trim() || undefined);
      // RootNavigator will handle routing
    } catch (e: any) {
      setError(e?.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Progress dots */}
        <View style={styles.progress}>
          {(["email","otp","details"] as Step[]).map((s, i) => (
            <View key={s} style={[styles.dot, step === s && styles.dotActive,
              (step === "otp" && i === 0) || (step === "details" && i <= 1) ? styles.dotDone : null]} />
          ))}
        </View>

        {/* ── STEP 1: Email & Name ── */}
        {step === "email" && (
          <>
            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.sub}>Step 1 of 3 — Enter your details to receive a verification code</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} placeholder="e.g. Aarav Sharma" placeholderTextColor={Colors.muted}
                value={name} onChangeText={setName} autoCapitalize="words" />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput style={styles.input} placeholder="e.g. aarav@gmail.com" placeholderTextColor={Colors.muted}
                value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleSendOTP} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send Verification Code →</Text>}
            </TouchableOpacity>
          </>
        )}

        {/* ── STEP 2: OTP Verification ── */}
        {step === "otp" && (
          <>
            <Text style={styles.heading}>Verify Your Email</Text>
            <Text style={styles.sub}>Step 2 of 3 — We sent a 6-digit code to</Text>
            <Text style={styles.emailHighlight}>{email}</Text>

            <View style={styles.otpRow}>
              {[0,1,2,3,4,5].map(i => (
                <TextInput
                  key={i}
                  style={[styles.otpBox, otpInput.length > i && styles.otpBoxFilled]}
                  maxLength={6}
                  keyboardType="number-pad"
                  value={i === 0 ? otpInput : ""}
                  onChangeText={v => setOtpInput(v.replace(/\D/g, "").slice(0, 6))}
                  placeholder="•"
                  placeholderTextColor={Colors.muted}
                />
              ))}
            </View>

            {/* Single real input behind the boxes */}
            <TextInput
              style={styles.hiddenInput}
              value={otpInput}
              onChangeText={v => setOtpInput(v.replace(/\D/g, "").slice(0, 6))}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />

            {otpError ? <Text style={styles.error}>{otpError}</Text> : null}

            <TouchableOpacity style={[styles.btn, (loading || otpInput.length < 6) && styles.btnDisabled]}
              onPress={handleVerifyOTP} disabled={loading || otpInput.length < 6}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Verify Code →</Text>}
            </TouchableOpacity>

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableOpacity onPress={handleResend} disabled={resendCooldown > 0 || loading}>
                <Text style={[styles.resendLink, resendCooldown > 0 && styles.resendDisabled]}>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => { setStep("email"); setOtpInput(""); setOtpError(""); }}>
              <Text style={styles.backLink}>← Change email</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── STEP 3: Password & Phone ── */}
        {step === "details" && (
          <>
            <Text style={styles.heading}>Set Your Password</Text>
            <Text style={styles.sub}>Step 3 of 3 — Almost done, {name.split(" ")[0]}!</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Phone Number (optional)</Text>
              <TextInput style={styles.input} placeholder="+91 XXXXX XXXXX" placeholderTextColor={Colors.muted}
                value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.pwRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Create a strong password"
                  placeholderTextColor={Colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.eyeBtn}>
                  <Text style={styles.eyeText}>{showPassword ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
              </View>

              {/* Strength bar */}
              {password.length > 0 && (
                <View style={styles.strengthBar}>
                  <View style={[styles.strengthFill, {
                    width: pwStrength === "weak" ? "33%" : pwStrength === "medium" ? "66%" : "100%",
                    backgroundColor: STRENGTH_COLORS[pwStrength]
                  }]} />
                </View>
              )}

              {/* Requirements checklist */}
              <View style={styles.requirements}>
                {[
                  { rule: "At least 6 characters",              ok: password.length >= 6 },
                  { rule: "At least 1 uppercase letter",         ok: /[A-Z]/.test(password) },
                  { rule: "At least 1 number",                   ok: /[0-9]/.test(password) },
                  { rule: "At least 1 special character (!@#$)", ok: /[^A-Za-z0-9]/.test(password) },
                ].map(({ rule, ok }) => (
                  <Text key={rule} style={[styles.req, ok ? styles.reqOk : styles.reqFail]}>
                    {ok ? "✓" : "✗"} {rule}
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[styles.input, confirmPassword.length > 0 && password !== confirmPassword && styles.inputError]}
                placeholder="Re-enter your password"
                placeholderTextColor={Colors.muted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <Text style={styles.error}>Passwords do not match</Text>
              )}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.btn, (loading || !pwValidation.isValid || password !== confirmPassword) && styles.btnDisabled]}
              onPress={handleCreateAccount}
              disabled={loading || !pwValidation.isValid || password !== confirmPassword}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create My Account ✓</Text>}
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:      { padding: 24, gap: 16, backgroundColor: Colors.background, flexGrow: 1 },
  progress:       { flexDirection: "row", gap: 8, justifyContent: "center", marginBottom: 8 },
  dot:            { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.border },
  dotActive:      { backgroundColor: Colors.primary, width: 24 },
  dotDone:        { backgroundColor: Colors.success },
  heading:        { color: Colors.text, fontSize: 26, fontWeight: "800" },
  sub:            { color: Colors.subtext, fontSize: 14, marginTop: -8 },
  emailHighlight: { color: Colors.primary, fontWeight: "700", fontSize: 15 },
  field:          { gap: 6 },
  label:          { color: Colors.subtext, fontSize: 13, fontWeight: "600" },
  input:          { backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 10, padding: 12, color: Colors.text, fontSize: 15 },
  inputError:     { borderColor: Colors.danger },
  pwRow:          { flexDirection: "row", gap: 8, alignItems: "center" },
  eyeBtn:         { padding: 10 },
  eyeText:        { fontSize: 18 },
  strengthBar:    { height: 4, backgroundColor: Colors.border, borderRadius: 4, marginTop: 6 },
  strengthFill:   { height: "100%", borderRadius: 4 },
  requirements:   { gap: 4, marginTop: 8 },
  req:            { fontSize: 12 },
  reqOk:          { color: Colors.success },
  reqFail:        { color: Colors.muted },
  otpRow:         { flexDirection: "row", gap: 10, justifyContent: "center", marginVertical: 8 },
  otpBox:         { width: 46, height: 56, borderWidth: 2, borderColor: Colors.border, borderRadius: 12, textAlign: "center", fontSize: 22, fontWeight: "700", color: Colors.text, backgroundColor: Colors.card },
  otpBoxFilled:   { borderColor: Colors.primary, backgroundColor: Colors.primaryLight + "33" },
  hiddenInput:    { position: "absolute", opacity: 0, height: 0 },
  btn:            { backgroundColor: Colors.primary, padding: 15, borderRadius: 12, alignItems: "center" },
  btnDisabled:    { backgroundColor: Colors.muted },
  btnText:        { color: "#fff", fontWeight: "800", fontSize: 16 },
  error:          { color: Colors.danger, fontSize: 13 },
  resendRow:      { flexDirection: "row", justifyContent: "center" },
  resendText:     { color: Colors.subtext, fontSize: 14 },
  resendLink:     { color: Colors.primary, fontSize: 14, fontWeight: "700" },
  resendDisabled: { color: Colors.muted },
  backLink:       { color: Colors.subtext, fontSize: 14, textAlign: "center" },
});