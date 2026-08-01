"use client";

import { useState } from "react";
import { useConnections, useDisconnectPage } from "@/features/inbox/hooks/useInbox";
import { ConversationList } from "@/features/inbox/components/ConversationList";
import { ChatWindow } from "@/features/inbox/components/ChatWindow";
import { ActivityLog } from "@/features/inbox/components/ActivityLog";
import { ConnectPageModal } from "@/features/inbox/components/ConnectPageModal";
import { ErrorPage } from "@/components/common/ErrorPage";
import { EmptyState } from "@/components/common/EmptyState";
import { useT } from "@/lib/i18n/use-t";
import type { InboxConversation } from "@/types/inbox";
import { MessageSquare, Plus, Globe, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function InboxPage() {
  const T = useT();
  const [activeTab, setActiveTab] = useState<"inbox" | "activity">("inbox");
  const [selected, setSelected] = useState<InboxConversation | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const { data: connections, isLoading, error } = useConnections();
  const disconnectPage = useDisconnectPage();

  const handleDisconnect = async (id: string, pageName: string) => {
    if (!confirm(`Disconnect "${pageName}"?`)) return;
    try {
      await disconnectPage.mutateAsync(id);
      setSelected(null);
      toast.success("Page disconnected.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to disconnect page.");
    }
  };

  if (error) {
    return (
      <ErrorPage
        title={T("inbox.errorTitle", "Failed to load inbox")}
        message={T("inbox.errorMessage", "Could not fetch your connected pages.")}
      />
    );
  }

  const connectedPages = connections ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{T("inbox.title")}</h1>
            <p className="text-sm text-gray-500">{T("inbox.subtitle")}</p>
          </div>
        </div>
        <button
          onClick={() => setShowConnectModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          {T("inbox.connectPage")}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : connectedPages.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <EmptyState
            icon={Globe}
            title={T("inbox.noPage")}
            message={T("inbox.noPageDesc")}
          />
          <div className="flex justify-center">
            <button
              onClick={() => setShowConnectModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              {T("inbox.connectPage")}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {T("inbox.connectedPages")}
            </span>
            {connectedPages.map((conn) => (
              <span
                key={conn._id}
                className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                <Globe className="h-3.5 w-3.5" />
                {conn.pageName}
                <button
                  onClick={() => handleDisconnect(conn._id, conn.pageName)}
                  className="text-blue-400 hover:text-red-500"
                  title="Disconnect"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("inbox")}
              className={cn(
                "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "inbox"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {T("inbox.tabInbox")}
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={cn(
                "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "activity"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {T("inbox.tabActivity")}
            </button>
          </div>

          {activeTab === "inbox" ? (
            <div className="grid grid-cols-1 gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white md:grid-cols-3">
              <div className="h-[520px] border-r border-gray-200 md:col-span-1">
                <ConversationList selectedId={selected?._id ?? null} onSelect={setSelected} />
              </div>
              <div className="h-[520px] md:col-span-2">
                <ChatWindow conversation={selected} />
              </div>
            </div>
          ) : (
            <ActivityLog />
          )}
        </>
      )}

      <ConnectPageModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnected={() => {}}
      />
    </div>
  );
}
