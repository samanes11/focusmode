"use client";

import { useEffect } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export default function Drawer({ open, onClose, sidebar, children }: DrawerProps) {
  // بستن با Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar*/}
      <aside className="hidden lg:flex flex-col w-72 min-h-screen shrink-0 bg-[#2d2520] border-l border-[#4a3f35]">
        {sidebar}
      </aside>

      {/* Main Content  */}
      <main className="flex-1 min-w-0 flex flex-col">
        {children}
      </main>
    </div>
  );
}
