import Link from "next/link";
import { Headphones } from "lucide-react";

import { AuthLayout, LoginForm } from "@/components/auth";

export default function LoginPage() {
  return (
    <AuthLayout title="Login">
      <LoginForm />
    </AuthLayout>
  );
}
