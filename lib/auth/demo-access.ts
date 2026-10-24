/** Public judge demo — password is seeded via `npm run db:seed`, not stored in client code. */
export const JUDGE_DEMO_EMAIL = "judge@hacknova.io";
export const JUDGE_DEMO_PASSWORD_HINT = "Prysm2026!";

export const DEMO_ACCESS_COPY = {
  title: "HackNova judge access",
  body: "Use the seeded workspace account to verify server-side auth, scrypt hashing, and HttpOnly sessions.",
  email: JUDGE_DEMO_EMAIL,
  password: JUDGE_DEMO_PASSWORD_HINT,
};
