export function StatusBar() {
  return (
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
  );
}
