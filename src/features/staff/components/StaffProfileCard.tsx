"use client";

import type { StaffMember } from "@/types/staff";
import { RoleBadge } from "./RoleBadge";

interface StaffProfileCardProps {
  staff: StaffMember;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "suspended":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function StaffProfileCard({ staff }: StaffProfileCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
      <dl className="space-y-3">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-500">Name</dt>
          <dd className="text-sm font-medium text-gray-900">{staff.name}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-500">Email</dt>
          <dd className="text-sm text-gray-900">{staff.email}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-500">Role</dt>
          <dd>
            <RoleBadge role={staff.role} />
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-500">Status</dt>
          <dd>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(staff.status)}`}
            >
              {staff.status}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
