export function SystemLog() {
  return (
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
