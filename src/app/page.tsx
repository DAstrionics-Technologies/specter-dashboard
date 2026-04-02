"use client";
import { useTelemetry } from "@/hooks/use-telemetry";
import dynamic from "next/dynamic";
import { StatusBar } from "@/components/dashboard/status-bar";
import { TelemetryPanel } from "@/components/dashboard/telemetry-panel";
import { SystemLog } from "@/components/dashboard/system-log";

const DroneMap = dynamic(
  () => import("@/components/dashboard/drone-map").then(mod => ({ default: mod.DroneMap })),
  { ssr: false }
);

export default function Dashboard() {
  const { data, status, error } = useTelemetry("drone-1");

  return (
    <div className="flex flex-col gap-6">
      <StatusBar />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Map + Feed */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Map */}
          <div className="relative w-full aspect-[21/9] bg-surface-container-low rounded overflow-hidden">
            {data ? (
              <DroneMap lat={data.lat} lon={data.lon} />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-on-surface-variant/40 font-headline text-sm uppercase tracking-widest">
                Awaiting telemetry...
              </div>
            )}
          </div>

          {/* Feed + Log */}
          <div className="grid grid-cols-2 gap-6">
            <div className="relative bg-surface-container rounded overflow-hidden aspect-video flex items-center justify-center">
              <span className="text-on-surface-variant/40 font-headline text-sm uppercase tracking-widest">
                Live feed — later
              </span>
            </div>
            <SystemLog />
          </div>
        </div>

        {/* Right Column: Telemetry */}
        <div className="col-span-12 lg:col-span-4">
          <TelemetryPanel data={data} />
        </div>
      </div>
    </div>
  );
}
