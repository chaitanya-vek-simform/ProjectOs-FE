import { Loader2 } from "lucide-react";

import { AiRiskAnalysis } from "@/components/risk/ai-risk-analysis";
import { RecommendedActions } from "@/components/risk/recommended-actions";
import { RiskFactorBreakdown } from "@/components/risk/risk-factor-breakdown";
import { RiskGauge } from "@/components/risk/risk-gauge";
import { RiskHistoryChart } from "@/components/risk/risk-history-chart";
import { LABELS } from "@/constants/labels";
import { useProject } from "@/contexts/useProject";
import { useRecomputeRisk } from "@/hooks/risk/mutations";
import { useLatestRisk, useRiskHistory } from "@/hooks/risk/queries";
import {
  toAnalysisParagraphs,
  toGaugeConfig,
  toRecommendedActions,
  toRiskFactors,
  toRiskHistoryPoints,
  trendToLabel,
} from "@/types/risk";

const RISK = LABELS.RISK;

function RiskPage() {
  const { projectId, isLoading: isProjectLoading } = useProject();
  const {
    data: latest,
    isLoading: isLatestLoading,
    isError: isLatestError,
  } = useLatestRisk(projectId);
  const { data: history } = useRiskHistory(projectId);
  const { recompute, isRecomputing } = useRecomputeRisk(projectId);

  if (isProjectLoading || isLatestLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <Loader2
          className="size-8 animate-spin text-indigo-600"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (isLatestError || !latest) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            {RISK.STATE.EMPTY_TITLE}
          </p>
          <p className="mt-1 text-sm text-slate-400">{RISK.STATE.EMPTY_BODY}</p>
          <button
            type="button"
            onClick={recompute}
            disabled={isRecomputing || !projectId}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRecomputing ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            {RISK.STATE.COMPUTE_CTA}
          </button>
        </div>
      </div>
    );
  }

  const gauge = toGaugeConfig(latest);
  const factors = toRiskFactors(latest);
  const paragraphs = toAnalysisParagraphs(latest.llm_explanation);
  const actions = toRecommendedActions(latest);
  const points = history ? toRiskHistoryPoints(history) : [];
  const historySubtitle = history
    ? `${trendToLabel(history.trend)} · ${RISK.HISTORY.AVERAGE_PREFIX} ${Math.round(
        history.average_score,
      )}`
    : undefined;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <RiskGauge {...gauge} />
        <RiskFactorBreakdown
          factors={factors}
          totalScore={gauge.value}
          maxScore={gauge.max}
          onRecompute={recompute}
          isRecomputing={isRecomputing}
        />
      </div>
      <AiRiskAnalysis paragraphs={paragraphs} />
      <div className="grid grid-cols-2 gap-4">
        <RecommendedActions actions={actions} />
        <RiskHistoryChart points={points} subtitle={historySubtitle} />
      </div>
    </div>
  );
}

export default RiskPage;
