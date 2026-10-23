import { Suspense } from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { SignupForm } from "../../components/auth/AuthForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Start monitoring"
      subtitle="Set up your workspace in under a minute — demo data included."
    >
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </AuthLayout>
  );
}
