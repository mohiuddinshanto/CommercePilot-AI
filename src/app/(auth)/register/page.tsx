import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Create Account - CommercePilot AI",
  description: "Create your CommercePilot AI account to start your journey.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
