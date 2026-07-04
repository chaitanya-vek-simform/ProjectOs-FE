import { StatusBadge } from "@/components/common/status-badge/status-badge";
import { LABELS } from "@/constants/labels";
import { RISK_GAUGE } from "@/constants/risk/mock";

const GAUGE = LABELS.RISK.GAUGE;

/**
 * RiskGauge — a presentational semicircular SVG gauge showing the current risk
 * score. The arcs (low/medium/high zones), needle and hub are hand-authored SVG
 * paths mirroring the prototype exactly.
 */
function RiskGauge() {
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
          aria-label={GAUGE.CAPTION}
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
            x2="36"
            y2="45"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="6" fill="#1e293b" />
        </svg>
      </div>
      <div className="mt-4 flex items-baseline justify-center gap-1">
        <span className="text-4xl font-black text-orange-500">
          {RISK_GAUGE.value}
        </span>
        <span className="text-sm font-medium text-slate-400">
          {GAUGE.SUFFIX}
        </span>
      </div>
      <StatusBadge tone={RISK_GAUGE.tone} className="mt-3 px-3 py-1 text-sm">
        {GAUGE.BADGE}
      </StatusBadge>
      <p className="mt-3 text-xs text-slate-400">{GAUGE.COMPUTED}</p>
    </div>
  );
}

export { RiskGauge };
