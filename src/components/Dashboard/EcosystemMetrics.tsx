import React from "react";
import { Activity } from "lucide-react";
import { MetricsChart } from "./MetricsChart";
import { TraitsScatterChart } from "./TraitsScatterChart";

export const EcosystemMetrics = ({
  history,
  stats,
}: {
  history: any[];
  stats: any[];
}) => {
  return (
    <>
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-10">
        <h2 className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
          <Activity size={14} className="animate-pulse" />
          Ecosystem Metrics
        </h2>
      </div>
      <div className="flex-1 flex flex-row overflow-hidden">
        <div className="flex-1 border-r border-slate-800 min-w-0 p-2">
          <TraitsScatterChart stats={stats} />
        </div>
        <div className="flex-1 min-w-0 p-2 pt-4">
          <MetricsChart history={history} population={stats.length} />
        </div>
      </div>
    </>
  );
};
