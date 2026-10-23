import { Suspense } from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { LoginForm } from "../../components/auth/AuthForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Access your command center, alerts, and evidence-linked briefs."
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
