"use client";

import { useAuth } from "@/contexts/auth-context";

const units = [
  { id: "unit-01", label: "Unit 01", active: true },
  { id: "unit-02", label: "Unit 02" },
  { id: "unit-03", label: "Unit 03" },
];

export function TopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-64 z-40 flex justify-between items-center px-6 h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15">
      <div className="flex items-center gap-6">
        <span className="font-headline font-black text-primary-container tracking-widest text-lg">
          SPECTER_UNIT_ALPHA
        </span>
        <nav className="hidden md:flex items-center gap-4">
          {units.map((unit) => (
            <a
              key={unit.id}
              href="#"
              className={`flex items-center gap-2 text-sm font-body transition-all ${
                unit.active
                  ? "text-secondary font-bold"
                  : "text-on-surface hover:text-primary"
              }`}
            >
              {unit.active && (
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              )}
              {unit.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-3 py-1 bg-surface-container rounded text-xs font-medium text-on-surface">
          <span className="material-symbols-outlined text-secondary text-sm">
            signal_cellular_4_bar
          </span>
          <span className="material-symbols-outlined text-secondary text-sm">
            battery_charging_full
          </span>
          <span className="material-symbols-outlined text-on-surface-variant text-sm">
            notifications
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="font-headline tracking-widest uppercase text-xs font-bold text-on-surface">
                {user.name}
              </span>
              <span className="font-body text-xs text-on-surface-variant">
                {user.email}
              </span>
            </div>
            <button
              type="button"
              onClick={() => void logout()}
              title="Sign out"
              className="w-8 h-8 rounded bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-on-surface-variant cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
