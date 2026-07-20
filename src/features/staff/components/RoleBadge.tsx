"use client";

function getRoleBadgeClass(role: string) {
  switch (role) {
    case "manager":
      return "bg-purple-100 text-purple-800";
    case "cashier":
      return "bg-blue-100 text-blue-800";
    case "inventory_manager":
      return "bg-orange-100 text-orange-800";
    case "sales_manager":
      return "bg-teal-100 text-teal-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

interface RoleBadgeProps {
  role: string;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeClass(role)}`}
    >
      {role.replace("_", " ")}
    </span>
  );
}
