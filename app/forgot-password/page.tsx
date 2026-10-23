import { AuthLayout } from "../../components/auth/AuthLayout";
import { ForgotPasswordForm } from "../../components/auth/AuthForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email and we will send a link to reset your password."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
