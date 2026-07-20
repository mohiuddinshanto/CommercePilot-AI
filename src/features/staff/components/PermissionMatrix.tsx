"use client";

import { STAFF_PERMISSIONS } from "@/constants/permissions";

interface PermissionMatrixProps {
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

const PERMISSION_LABELS: Record<string, string> = {
  [STAFF_PERMISSIONS.PRODUCTS]: "Products",
  [STAFF_PERMISSIONS.CATEGORIES]: "Categories",
  [STAFF_PERMISSIONS.INVENTORY]: "Inventory",
  [STAFF_PERMISSIONS.SALES]: "Sales",
  [STAFF_PERMISSIONS.REPORTS]: "Reports",
  [STAFF_PERMISSIONS.ANALYTICS]: "Analytics",
  [STAFF_PERMISSIONS.STAFF]: "Staff",
  [STAFF_PERMISSIONS.SETTINGS]: "Settings",
  [STAFF_PERMISSIONS.AI]: "AI Copilot",
};

export function PermissionMatrix({
  selectedPermissions,
  onChange,
  disabled = false,
}: PermissionMatrixProps) {
  const allPermissions = Object.values(STAFF_PERMISSIONS);

  const togglePermission = (permission: string) => {
    if (disabled) return;
    if (selectedPermissions.includes(permission)) {
      onChange(selectedPermissions.filter((p) => p !== permission));
    } else {
      onChange([...selectedPermissions, permission]);
    }
  };

  const selectAll = () => {
    if (disabled) return;
    onChange([...allPermissions]);
  };

  const clearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Permissions
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            disabled={disabled}
            className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            Select All
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled}
            className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            Clear All
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {allPermissions.map((permission) => (
          <label
            key={permission}
            className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm ${
              selectedPermissions.includes(permission)
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-600"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-300"}`}
          >
            <input
              type="checkbox"
              checked={selectedPermissions.includes(permission)}
              onChange={() => togglePermission(permission)}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>{PERMISSION_LABELS[permission] || permission}</span>
          </label>
        ))}
      </div>
      {selectedPermissions.length === 0 && (
        <p className="text-xs text-red-500">At least one permission is required.</p>
      )}
    </div>
  );
}
