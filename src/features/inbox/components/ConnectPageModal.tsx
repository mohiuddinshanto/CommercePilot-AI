"use client";

import { useState } from "react";
import { SalesModal } from "@/features/sales/components/SalesModal";
import { useConnectPage } from "../hooks/useInbox";
import toast from "react-hot-toast";

interface ConnectPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export function ConnectPageModal({ isOpen, onClose, onConnected }: ConnectPageModalProps) {
  const [platform, setPlatform] = useState("facebook");
  const [pageId, setPageId] = useState("");
  const [pageName, setPageName] = useState("");
  const [pageAccessToken, setPageAccessToken] = useState("");
  const connectPage = useConnectPage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await connectPage.mutateAsync({
        platform,
        pageId: pageId.trim(),
        pageName: pageName.trim(),
        pageAccessToken: pageAccessToken.trim(),
      });
      toast.success("Facebook page connected successfully.");
      setPageId("");
      setPageName("");
      setPageAccessToken("");
      onClose();
      onConnected();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to connect page.");
    }
  };

  return (
    <SalesModal title="Connect Facebook Page" onClose={onClose} isOpen={isOpen}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="facebook">Facebook Messenger</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Page ID</label>
          <input
            type="text"
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
            placeholder="e.g. 123456789012345"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            You can find this in your Facebook page URL or Meta Business settings.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Page Name</label>
          <input
            type="text"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            placeholder="Optional — auto-detected from the token"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Page Access Token</label>
          <textarea
            value={pageAccessToken}
            onChange={(e) => setPageAccessToken(e.target.value)}
            placeholder="Paste your long-lived Page Access Token here"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            rows={3}
            required
          />
        </div>

        <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
          Go to the Meta Developer Dashboard → your app → Messenger → Settings to copy a Page Access Token
          for your test page. The app must be in Development Mode with the page added as a test page.
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={connectPage.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {connectPage.isPending ? "Connecting..." : "Connect Page"}
          </button>
        </div>
      </form>
    </SalesModal>
  );
}
