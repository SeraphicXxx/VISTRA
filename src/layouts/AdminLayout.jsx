import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Search, Bell } from "lucide-react";

import Sidebar from "../pages/admin/sidebar";

export default function AdminLayout() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-textPrimary selection:bg-primary/20">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border bg-surface px-8 py-4">
          <div>
            <h1 className="font-heading text-xl font-semibold text-textPrimary">
              Good morning, Dr. Fiesta
            </h1>
            <p className="mt-0.5 text-xs text-textMuted">
              Tuesday, August 4 · Clinic Operations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted"
                strokeWidth={2}
              />
              <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-72 rounded-xl border border-border bg-background py-2.5 pl-9 pr-3.5 text-sm text-textPrimary placeholder:text-textMuted focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            </div>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-textSecondary hover:text-textPrimary"
            >
              <Bell className="h-4 w-4" strokeWidth={2} />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white">
              LMF
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}