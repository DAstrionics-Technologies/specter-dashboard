import type { TelemetryData, ConnectionStatus } from "@/types/telemetry";
import { TelemetryCard } from "./telemetry-card";

export function TelemetryPanel({ data, status }: { data: TelemetryData | null; status: ConnectionStatus }) {
  const isStale = status !== "connected";

  return (
    <div className={`bg-surface-container p-6 rounded transition-opacity ${isStale ? "opacity-60" : ""}`}>
      <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">
          settings_input_component
        </span>
        Critical Telemetry
      </h3>

      <div className="grid grid-cols-1 gap-4">
        <TelemetryCard label="Altitude" icon="height" value={data ? data.alt.toFixed(1) : "--"} unit="m" />
        <TelemetryCard label="Ground Speed" icon="speed" value={data ? data.speed.toFixed(1) : "--"} unit="m/s" />
        <TelemetryCard label="Power Supply" icon="bolt" value={data ? data.battery.toFixed(1) : "--"} unit="%" secondaryValue={data?.voltage.toFixed(1)} secondaryUnit="V" accent="secondary" />
        <TelemetryCard label="GPS" icon="satellite_alt" value={data ? data.gps_fix_type.toFixed(0) : "--"} secondaryValue={data?.satellites.toFixed(0)} secondaryUnit="sats" unit="" />
      </div>
    </div>
  );
}
