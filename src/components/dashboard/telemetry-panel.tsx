import type { TelemetryData } from "@/types/telemetry";
import { TelemetryCard } from "./telemetry-card";

export function TelemetryPanel({ data }: { data: TelemetryData | null }) {
  return (
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
  );
}
