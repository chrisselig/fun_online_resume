const NAV_ITEMS = [
  { href: "#profile", label: "Profile" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#portfolio", label: "Portfolio" },
];

export function Sidebar({ name }: { name: string }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col bg-nav px-4 py-6 lg:flex">
      <div className="flex items-center gap-2 px-2">
        <span className="h-3 w-3 rounded-sm bg-gold" aria-hidden />
        <p className="font-mono text-xs font-semibold tracking-wide text-white/90">
          RESUME.PBIX
        </p>
      </div>

      <nav className="mt-10 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto px-3 text-xs text-white/40">
        <p>{name}</p>
        <p className="mt-1">Workspace · Career Analytics</p>
      </div>
    </aside>
  );
}
