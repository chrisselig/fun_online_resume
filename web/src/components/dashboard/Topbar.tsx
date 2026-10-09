export function Topbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-3 sm:px-10">
      <p className="text-sm text-muted">
        Dashboards <span className="mx-1 text-border">/</span> Resume{" "}
        <span className="mx-1 text-border">/</span>{" "}
        <span className="font-medium text-ink">Chris Selig</span>
      </p>
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-border bg-canvas px-3 py-1 text-xs text-muted">
          Period: Last 18 years ▾
        </span>
        <span className="rounded-full border border-border bg-canvas px-3 py-1 text-xs text-muted">
          Industry: All ▾
        </span>
      </div>
    </div>
  );
}
