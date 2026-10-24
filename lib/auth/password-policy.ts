/** Shared client + server password rules (no Node crypto). */
export const PASSWORD_POLICY = {
  minLength: 8,
  message: "Password must be at least 8 characters and include a letter and a number.",
  validate(password: string): boolean {
    return (
      password.length >= this.minLength &&
      /[A-Za-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  },
} as const;
