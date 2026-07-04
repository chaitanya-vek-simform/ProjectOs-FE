import { StatusBadge } from "@/components/common/status-badge/status-badge";
import { LABELS } from "@/constants/labels";
import { cn } from "@/lib/utils";

import type { RiskGaugeConfig } from "@/types/risk";
import type { StatusTone } from "@/types/common";

const GAUGE = LABELS.RISK.GAUGE;

/** Radius the needle points along, from the gauge centre (100, 100). */
const NEEDLE_RADIUS = 64;

const VALUE_TEXT_CLASS: Record<StatusTone, string> = {
  low: "text-emerald-500",
  medium: "text-amber-500",
  high: "text-orange-500",
  critical: "text-red-500",
  info: "text-indigo-500",
  neutral: "text-slate-500",
};

/** Compute the needle tip for a value across the 180°→0° semicircle. */
function needleTip(value: number, max: number): { x: number; y: number } {
  const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const angle = (180 - ratio * 180) * (Math.PI / 180);
  return {
    x: 100 + NEEDLE_RADIUS * Math.cos(angle),
    y: 100 - NEEDLE_RADIUS * Math.sin(angle),
  };
}

/**
 * RiskGauge — a semicircular SVG gauge showing the current risk score. The zone
 * arcs are static; the needle rotates to reflect the live `value`.
 */
function RiskGauge({
  value,
  max,
  tone,
  levelLabel,
  computedLabel,
}: RiskGaugeConfig) {
  const tip = needleTip(value, max);

  return (
    <div className="col-span-1 flex flex-col items-center rounded-xl border border-slate-200 bg-white p-5 py-6 shadow-sm">
      <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
        {GAUGE.CAPTION}
      </p>
      <div className="relative w-full">
        <svg
          viewBox="0 0 200 110"
          className="w-full"
          role="img"
          aria-label={`${GAUGE.CAPTION}: ${value}${GAUGE.SUFFIX}`}
        >
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 20 100 A 80 80 0 0 1 68 27"
            fill="none"
            stroke="#10b981"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 68 27 A 80 80 0 0 1 132 27"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="16"
          />
          <path
            d="M 132 27 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#f97316"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <line
            x1="100"
            y1="100"
            x2={tip.x}
            y2={tip.y}
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="6" fill="#1e293b" />
        </svg>
      </div>
      <div className="mt-4 flex items-baseline justify-center gap-1">
        <span className={cn("text-4xl font-black", VALUE_TEXT_CLASS[tone])}>
          {value}
        </span>
        <span className="text-sm font-medium text-slate-400">
          {GAUGE.SUFFIX}
        </span>
      </div>
      <StatusBadge tone={tone} className="mt-3 px-3 py-1 text-sm">
        {levelLabel}
      </StatusBadge>
      {computedLabel ? (
        <p className="mt-3 text-xs text-slate-400">
          {GAUGE.COMPUTED_PREFIX} {computedLabel}
        </p>
      ) : null}
    </div>
  );
}

export { RiskGauge };
