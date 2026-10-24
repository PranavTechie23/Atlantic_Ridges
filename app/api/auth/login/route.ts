import { NextResponse } from "next/server";
import { authenticateUser } from "../../../../lib/auth/user-store";
import { setSessionCookie } from "../../../../lib/auth/session";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";

    const result = await authenticateUser(email, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    await setSessionCookie(result.user.id);
    return NextResponse.json({ user: result.user });
  } catch (err) {
    console.error("[auth/login]", err);
    return NextResponse.json(
      {
        error:
          "Authentication service unavailable. Start PostgreSQL and run npm run db:seed, or use demo workspace.",
      },
      { status: 503 }
    );
  }
}
