"use client";

import { useState } from "react";
import { STAFF_ROLES } from "@/constants/roles";
import { PermissionMatrix } from "./PermissionMatrix";
import type { StaffMember, UpdateStaffInput } from "@/types/staff";

interface StaffFormProps {
  staff: StaffMember;
  onSubmit: (input: UpdateStaffInput) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function StaffForm({ staff, onSubmit, onCancel, isLoading }: StaffFormProps) {
  const [role, setRole] = useState<string>(staff.role);
  const [permissions, setPermissions] = useState<string[]>(staff.permissions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (permissions.length === 0) return;
    onSubmit({ role, permissions });
  };

  const roles = Object.values(STAFF_ROLES);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={staff.name}
          disabled
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={staff.email}
          disabled
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <PermissionMatrix
        selectedPermissions={permissions}
        onChange={setPermissions}
      />

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || permissions.length === 0}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
