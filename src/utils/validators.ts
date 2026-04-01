export const isEmailValid = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isStrongPassword = (password: string): boolean => {
  return password.trim().length >= 6;
};

export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};