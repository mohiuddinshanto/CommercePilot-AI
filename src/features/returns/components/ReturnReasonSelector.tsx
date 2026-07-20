"use client";

export const RETURN_REASONS = [
  "Defective Product",
  "Wrong Item Received",
  "Damaged in Transit",
  "Changed Mind",
  "Size/Color Mismatch",
  "Better Price Found",
  "Quality Not as Expected",
  "Late Delivery",
  "Not as Described",
  "Other",
] as const;

interface ReturnReasonSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ReturnReasonSelector({ value, onChange }: ReturnReasonSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Return Reason *</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Select a reason</option>
        {RETURN_REASONS.map((reason) => (
          <option key={reason} value={reason}>
            {reason}
          </option>
        ))}
      </select>
    </div>
  );
}
