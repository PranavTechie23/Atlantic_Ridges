import { NextResponse } from "next/server";
import { createUser } from "../../../../lib/auth/user-store";
import { setSessionCookie } from "../../../../lib/auth/session";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const result = await createUser({
      name: body.name ?? "",
      email: body.email ?? "",
      password: body.password ?? "",
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await setSessionCookie(result.user.id);
    return NextResponse.json({ user: result.user });
  } catch (err) {
    console.error("[auth/signup]", err);
    return NextResponse.json(
      {
        error:
          "Could not create account. Ensure PostgreSQL is running and schema is initialized (npm run db:seed).",
      },
      { status: 503 }
    );
  }
}
