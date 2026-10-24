/** Duration of the full-screen sign-out overlay before navigation */
export const SIGN_OUT_ANIMATION_MS = 680;

export const SIGN_OUT_COPY = {
  overlay: {
    message: "Signing you out",
    subtitle: "Clearing your secure session…",
  },
  loginFlash: {
    message: "You're signed out safely",
    subtitle:
      "Your HttpOnly session was cleared. Sign in anytime to return to the command center.",
  },
  loginFlashDurationMs: 3400,
} as const;
