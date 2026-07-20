import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Welcome Back - CommercePilot AI",
  description: "Sign in to your CommercePilot AI account to manage your business.",
};

export default function LoginPage() {
  return <LoginForm />;
}
