"use client";

import { formatNumber } from "@/lib/utils";
import { Database, Server, HardDrive, Clock } from "lucide-react";
import type { SystemStats } from "../types/admin";

interface SystemHealthProps {
  data: SystemStats | null;
}

export function SystemHealth({ data }: SystemHealthProps) {
  if (!data) return null;
  const uptimeHours = Math.floor(data.uptime / 3600);
  const uptimeMinutes = Math.floor((data.uptime % 3600) / 60);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Collections</p>
              <p className="text-xl font-bold text-gray-900">{data.totalCollections}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
              <HardDrive className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Documents</p>
              <p className="text-xl font-bold text-gray-900">
                {formatNumber(data.totalDocuments)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
              <Server className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">DB Size</p>
              <p className="text-xl font-bold text-gray-900">{data.dbSize}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Uptime</p>
              <p className="text-xl font-bold text-gray-900">
                {uptimeHours}h {uptimeMinutes}m
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">System Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Node Version</p>
            <p className="text-sm font-medium text-gray-900">{data.nodeVersion}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Platform</p>
            <p className="text-sm font-medium text-gray-900">{data.platform}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Collection Statistics</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(data.collections)
            .sort(([, a], [, b]) => b - a)
            .map(([name, count]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
              >
                <span className="text-sm text-gray-700">{name}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumber(count)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
