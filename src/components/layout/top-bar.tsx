"use client";

const units = [
  { id: "unit-01", label: "Unit 01", active: true },
  { id: "unit-02", label: "Unit 02" },
  { id: "unit-03", label: "Unit 03" },
];

export function TopBar() {
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
        <div className="w-8 h-8 rounded bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">
            person
          </span>
        </div>
      </div>
    </header>
  );
}
