import { Loader2 } from "lucide-react";

import { ProgressBar } from "@/components/common/progress-bar/progress-bar";
import { LABELS } from "@/constants/labels";
import { cn } from "@/lib/utils";

import { FACTOR_SCORE_CLASS, type RiskFactor } from "@/types/risk";

const FACTORS = LABELS.RISK.FACTORS;

interface RiskFactorBreakdownProps {
  factors: RiskFactor[];
  totalScore: number;
  maxScore: number;
  onRecompute: () => void;
  isRecomputing: boolean;
}

/** RiskFactorBreakdown — scored contributors to the overall risk with a total row. */
function RiskFactorBreakdown({
  factors,
  totalScore,
  maxScore,
  onRecompute,
  isRecomputing,
}: RiskFactorBreakdownProps) {
  return (
    <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">
          {FACTORS.TITLE}
        </h3>
        <button
          type="button"
          onClick={onRecompute}
          disabled={isRecomputing}
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRecomputing ? (
            <>
              <Loader2 className="size-3 animate-spin" aria-hidden="true" />
              {FACTORS.RECOMPUTING}
            </>
          ) : (
            FACTORS.RECOMPUTE
          )}
        </button>
      </div>
      <div className="space-y-3">
        {factors.map((factor) => (
          <div key={factor.id}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-slate-700">{factor.label}</span>
              <span
                className={cn(
                  "font-semibold",
                  FACTOR_SCORE_CLASS[factor.scoreTone],
                )}
              >
                {factor.score}
              </span>
            </div>
            <ProgressBar
              value={factor.progressValue}
              fillClassName={factor.fillClassName}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
        <span className="text-sm font-semibold text-slate-900">
          {FACTORS.TOTAL_LABEL}
        </span>
        <span className="text-lg font-bold text-orange-500">
          {LABELS.RISK.DYNAMIC.SCORE(totalScore, maxScore)}
        </span>
      </div>
    </div>
  );
}

export { RiskFactorBreakdown };
