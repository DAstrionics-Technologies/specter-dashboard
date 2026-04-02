"use client";

const navItems = [
  { icon: "dashboard", label: "Dashboard", active: true },
  { icon: "videocam", label: "Live View" },
  { icon: "analytics", label: "Telemetry" },
  { icon: "terminal", label: "Commands" },
  { icon: "assignment", label: "Mission Plans" },
  { icon: "settings_remote", label: "Drone Settings" },
  { icon: "person", label: "Account" },
  { icon: "settings", label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="flex flex-col h-screen w-64 sticky top-0 bg-surface z-50">
      {/* Branding */}
      <div className="p-6 flex flex-col gap-1">
        <span className="text-2xl font-black tracking-tighter text-primary font-headline">
          SPECTER
        </span>
        <span className="font-headline tracking-wider uppercase text-xs font-bold text-primary/60">
          Operational Intelligence
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        <ul className="flex flex-col">
          {navItems.map((item) => (
            <li
              key={item.label}
              className={`group cursor-pointer font-headline tracking-wider uppercase text-xs font-bold transition-colors duration-200 ${
                item.active
                  ? "text-primary border-l-2 border-primary-container bg-surface-container"
                  : "text-on-surface/60 hover:text-on-surface hover:bg-surface-bright"
              }`}
            >
              <div className="flex items-center gap-3 px-6 py-4">
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse */}
      <div className="p-6 border-t border-outline-variant/15">
        <div className="flex items-center gap-3 text-on-surface/60 font-headline tracking-wider uppercase text-xs font-bold cursor-pointer hover:text-on-surface">
          <span className="material-symbols-outlined">menu_open</span>
          <span>Collapse</span>
        </div>
      </div>
    </aside>
  );
}
