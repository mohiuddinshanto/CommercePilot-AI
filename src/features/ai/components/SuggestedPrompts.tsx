"use client";

import { Sparkles } from "lucide-react";
import { SUGGESTED_PROMPTS } from "@/types/ai";

interface SuggestedPromptProps {
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelect }: SuggestedPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
        <Sparkles className="h-8 w-8 text-blue-600" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-gray-900">AI Business Copilot</h2>
      <p className="mb-8 max-w-md text-center text-sm text-gray-500">
        Ask questions about your store data. Get insights on sales, inventory, products, and more.
      </p>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
