import { TelemetryData, ConnectionStatus } from "@/types/telemetry";

// Cloud schema accepts any [A-Z0-9_]{1,32} for flight_mode (open string,
// not a closed enum) so the dashboard must tolerate UNKNOWN during boot
// and any firmware mode it doesn't recognise. Safety modes get a distinct
// tone for at-a-glance ops awareness; everything else renders neutrally.
const SAFETY_MODES = new Set([
    "RTL", "SMART_RTL", "LAND", "BRAKE", "AUTOLAND",
]);

type FlightModeTone = "boot" | "safety" | "normal";

function describeFlightMode(mode: string | undefined): { display: string; tone: FlightModeTone } {
    if (!mode) return { display: "—", tone: "boot" };
    if (mode === "UNKNOWN") return { display: "INITIALIZING", tone: "boot" };
    if (SAFETY_MODES.has(mode)) return { display: mode, tone: "safety" };
    return { display: mode, tone: "normal" };
}

const FLIGHT_MODE_TONE_CLASS: Record<FlightModeTone, string> = {
    boot: "text-on-surface-variant/50 italic",
    safety: "text-error",
    normal: "text-on-surface",
};

const CONNECTION_LABELS: Record<ConnectionStatus, { text: string; tone: string }> = {
    connecting: { text: "Connecting", tone: "text-on-surface-variant" },
    connected:  { text: "Live",       tone: "text-secondary" },
    stale:      { text: "Stale",      tone: "text-error" },
    error:      { text: "Lost",       tone: "text-error" },
};

export function StatusBar({ data, status }: { data: TelemetryData | null; status: ConnectionStatus }) {
    const isStale = status !== "connected";
    const flightMode = describeFlightMode(data?.flight_mode);
    const connection = CONNECTION_LABELS[status];

    return (
        <div className={`flex items-center justify-between p-4 bg-surface-container rounded border-l-4 transition-opacity ${data?.armed ? "border-secondary" : "border-error"} ${isStale ? "opacity-60" : ""}`}>
            <div className="flex items-center gap-8">
                <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">
                        ARM STATUS
                    </p>
                    <div className="flex items-center gap-2">
                        <span className={`${data?.armed ? "text-secondary" : "text-error"} font-headline font-bold text-xl uppercase tracking-tighter`}>
                            {data?.armed ? "Armed" : "Disarmed"}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${data?.armed ? "bg-secondary" : "bg-error-container"} shadow-[0_0_8px_rgba(6,187,99,0.8)]`} />
                    </div>
                </div>
                <div className="w-px h-10 bg-outline-variant/20" />
                <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">
                        FLIGHT MODE
                    </p>
                    <p className={`${FLIGHT_MODE_TONE_CLASS[flightMode.tone]} font-headline font-bold text-xl uppercase tracking-tighter`}>
                        {flightMode.display}
                    </p>
                </div>
                <div className="w-px h-10 bg-outline-variant/20" />
                <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">
                        CONNECTION
                    </p>
                    <p className={`${connection.tone} font-headline font-bold text-xl uppercase tracking-tighter`}>
                        {connection.text}
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
    );
}
