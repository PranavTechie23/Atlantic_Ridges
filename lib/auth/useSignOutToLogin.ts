"use client";

/** Shared sign-out → login navigation for menu and settings */
export async function signOutToLogin(
  signOutAnimated: () => Promise<void>,
  router: { push: (href: string) => void }
) {
  await signOutAnimated();
  router.push("/login?loggedOut=1");
}
