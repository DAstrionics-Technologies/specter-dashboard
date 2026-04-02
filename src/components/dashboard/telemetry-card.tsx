export function TelemetryCard({
  label,
  icon,
  value,
  unit,
  accent = "primary",
}: {
  label: string;
  icon: string;
  value: string;
  unit: string;
  accent?: "primary" | "secondary";
}) {
  return (
    <div className={`bg-surface-container-low p-4 rounded-sm border-l-2 border-${accent}`}>
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
          {label}
        </span>
        <span className={`material-symbols-outlined text-${accent} text-lg`}>{icon}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-headline text-3xl font-black text-on-surface tabular-nums tracking-tighter">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-bold text-on-surface-variant tracking-wider uppercase">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
