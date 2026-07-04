import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { LABELS } from "@/constants/labels";

import type { RiskHistoryPoint } from "@/types/risk";

const HISTORY = LABELS.RISK.HISTORY;

interface RiskHistoryChartProps {
  points: RiskHistoryPoint[];
  subtitle?: string;
}

/** RiskHistoryChart — risk-score trend over time as a filled area line. */
function RiskHistoryChart({ points, subtitle }: RiskHistoryChartProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">
          {HISTORY.TITLE}
        </h3>
        <p className="text-xs text-slate-400">{subtitle ?? HISTORY.SUBTITLE}</p>
      </div>
      {points.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={points}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#f97316"
              strokeWidth={2}
              fill="#f97316"
              fillOpacity={0.12}
              dot={{ r: 3, fill: "#f97316" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-slate-400">{HISTORY.EMPTY}</p>
        </div>
      )}
    </div>
  );
}

export { RiskHistoryChart };
