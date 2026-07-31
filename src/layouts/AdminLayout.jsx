import React from "react";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation can go here */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
