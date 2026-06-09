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
      {/* ── Desktop Sidebar (همیشه visible در lg+) ── */}
      <aside className="hidden lg:flex flex-col w-72 min-h-screen shrink-0 bg-[#2d2520] border-l border-[#4a3f35]">
        {sidebar}
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {open && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
          />
          {/* panel */}
          <aside
            className="fixed top-0 right-0 z-50 flex flex-col w-72 h-full bg-[#2d2520] border-l border-[#4a3f35] lg:hidden"
            style={{ animation: "slideInRight 200ms ease-out" }}
          >
            {sidebar}
          </aside>
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(100%); opacity: 0; }
              to   { transform: translateX(0);    opacity: 1; }
            }
          `}</style>
        </>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 flex flex-col">
        {children}
      </main>
    </div>
  );
}
