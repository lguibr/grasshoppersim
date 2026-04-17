import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { MetricPoint } from "../../store";
import { getMetricsChartOptions } from "./chartOptions";

export const MetricsChart = ({
  history,
  population,
}: {
  history: MetricPoint[];
  population: number;
}) => {
  const slicedHistory = useMemo(() => history.slice(-360), [history]);
  const option = useMemo(() => getMetricsChartOptions(slicedHistory), [slicedHistory]);

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden">
      <div className="absolute top-1 left-2 z-10 flex flex-wrap text-[9px] font-black tracking-[0.2em] uppercase gap-x-2 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
        <span className="text-emerald-400">Pop: {population}</span>
        <span className="text-amber-400">Food: {history[history.length - 1]?.food || 0}</span>
        <span className="text-blue-400">Spd</span>
        <span className="text-rose-400">Agr</span>
        <span className="text-purple-500">Age</span>
        <span className="text-teal-500">HP</span>
      </div>
      <div className="flex-1 w-full h-full min-h-0 absolute inset-0">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          notMerge={false}
          lazyUpdate={true}
        />
      </div>
    </div>
  );
};
