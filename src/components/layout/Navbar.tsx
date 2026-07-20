"use client";

import { useAuth } from "@/providers/auth-provider";
import { LogOut, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/actions/auth.actions";

export function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutAction();
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {user?.name || "User"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
