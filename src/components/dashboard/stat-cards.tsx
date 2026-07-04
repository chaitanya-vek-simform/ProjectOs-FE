import { ProgressBar } from "@/components/common/progress-bar/progress-bar";
import { StatusBadge } from "@/components/common/status-badge/status-badge";
import { cn } from "@/lib/utils";

import type { StatCard } from "@/types/dashboard";

function StatCardItem({ card }: { card: StatCard }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-1 text-xs font-medium text-slate-500">{card.label}</p>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "text-3xl font-bold",
            card.id === "risk-score" ? "text-orange-500" : "text-slate-900",
          )}
        >
          {card.value}
        </span>
        {card.suffix ? (
          <span className="text-sm text-slate-400">{card.suffix}</span>
        ) : null}
        {card.badge ? (
          <StatusBadge tone={card.badge.tone} className="ml-auto">
            {card.badge.text}
          </StatusBadge>
        ) : null}
      </div>
      {card.progress ? (
        <ProgressBar
          value={card.progress.value}
          fillClassName={card.progress.fillClassName}
          className="mt-3"
        />
      ) : null}
      {card.caption ? (
        <p className="mt-2 text-xs text-slate-400">{card.caption}</p>
      ) : null}
      {card.alert ? (
        <p className="mt-2 text-xs font-medium text-red-500">{card.alert}</p>
      ) : null}
    </div>
  );
}

function StatCards({ cards }: { readonly cards: StatCard[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCardItem key={card.id} card={card} />
      ))}
    </div>
  );
}

export { StatCards };
