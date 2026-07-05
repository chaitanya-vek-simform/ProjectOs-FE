interface AppTopbarProps {
  title: string;
  subtitle: string;
}

/** AppTopbar — page title + subtitle, AI-ready pill. */
function AppTopbar({ title, subtitle }: AppTopbarProps) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </header>
  );
}

export { AppTopbar };
