"use client"
import { useTelemetry } from "@/hooks/use-telemetry";

export default function Dashboard() {
  const { data, status, error } = useTelemetry("drone-1")
  return (
    <div className="flex flex-col gap-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between p-4 bg-surface-container rounded border-l-4 border-secondary">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">
              ARM STATUS
            </p>
            <div className="flex items-center gap-2">
              <span className="text-secondary font-headline font-bold text-xl uppercase tracking-tighter">
                Armed
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(6,187,99,0.8)]" />
            </div>
          </div>
          <div className="w-px h-10 bg-outline-variant/20" />
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">
              FLIGHT MODE
            </p>
            <p className="text-on-surface font-headline font-bold text-xl uppercase tracking-tighter">
              STABILIZE
            </p>
          </div>
          <div className="w-px h-10 bg-outline-variant/20" />
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">
              SYSTEM UPTIME
            </p>
            <p className="text-on-surface font-headline font-bold text-xl tabular-nums tracking-tighter">
              00:00
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-2 bg-error-container text-on-error-container text-xs font-bold uppercase tracking-widest rounded-sm hover:brightness-110 transition-all">
            Emergency Land
          </button>
          <button className="px-6 py-2 bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-widest rounded-sm hover:brightness-110 transition-all">
            Disarm
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Map + Feed */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Map placeholder */}
          <div className="relative w-full aspect-[21/9] bg-surface-container-low rounded overflow-hidden flex items-center justify-center">
            <span className="text-on-surface-variant/40 font-headline text-sm uppercase tracking-widest">
              Map — coming soon
            </span>
          </div>

          {/* Feed + Log */}
          <div className="grid grid-cols-2 gap-6">
            {/* Video placeholder */}
            <div className="relative bg-surface-container rounded overflow-hidden aspect-video flex items-center justify-center">
              <span className="text-on-surface-variant/40 font-headline text-sm uppercase tracking-widest">
                Live feed — later
              </span>
            </div>

            {/* System Log */}
            <div className="bg-surface-container rounded p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  System Log
                </h3>
                <span className="text-[10px] text-primary cursor-pointer hover:underline">
                  View All
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <LogEntry color="bg-secondary" text="Awaiting telemetry stream..." time="--:--:--" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry Panel */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-surface-container p-6 rounded">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">
                settings_input_component
              </span>
              Critical Telemetry
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <TelemetryCard label="Altitude" icon="height" value={data ? data.alt.toFixed(1) : "--"} unit="m" />
              <TelemetryCard label="Ground Speed" icon="speed" value={data ? data.speed.toFixed(1) : "--"} unit="m/s" />
              <TelemetryCard label="Power Supply" icon="bolt" value={data ? data.battery.toFixed(1) : "--"} unit="%" accent="secondary" />
              <TelemetryCard label="GPS" icon="satellite_alt" value="--" unit="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TelemetryCard({
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

function LogEntry({ color, text, time }: { color: string; text: string; time: string }) {
  return (
    <div className="flex gap-3 items-start">
      <span className={`w-1.5 h-1.5 rounded-full ${color} mt-1.5`} />
      <div>
        <p className="text-xs text-on-surface leading-tight">{text}</p>
        <p className="text-[10px] text-on-surface-variant/60 font-medium mt-0.5">{time}</p>
      </div>
    </div>
  );
}
