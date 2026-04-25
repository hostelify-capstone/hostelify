/**
 * Password strength validator.
 * Rules: min 6 chars, ≥1 uppercase, ≥1 digit, ≥1 special character.
 */

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 6) errors.push("At least 6 characters");
  if (!/[A-Z]/.test(password)) errors.push("At least 1 uppercase letter (A–Z)");
  if (!/[0-9]/.test(password)) errors.push("At least 1 number (0–9)");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("At least 1 special character (!@#$%^&*)");

  return { isValid: errors.length === 0, errors };
}

export function getPasswordStrength(password: string): "weak" | "medium" | "strong" {
  const { errors } = validatePassword(password);
  if (errors.length >= 3) return "weak";
  if (errors.length === 1 || errors.length === 2) return "medium";
  return "strong";
}
