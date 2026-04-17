import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Colors } from "@/constants/colors";

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string, phone?: string) => Promise<void>;
}

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setError(null);
      setLoading(true);
      await onSubmit(name, email, password, phone || undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input label="Full Name" value={name} onChangeText={setName} />
      <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input label="Phone (optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Password (min 6 chars)" value={password} onChangeText={setPassword} secureTextEntry />
      <Input label="Confirm Password" value={confirm} onChangeText={setConfirm} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Create Account" onPress={handleRegister} loading={loading} variant="secondary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12
  },
  error: {
    color: Colors.danger,
    fontSize: 13
  }
});