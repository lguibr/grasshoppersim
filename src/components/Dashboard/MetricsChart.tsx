import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { MetricPoint } from '../../store';
import { getMetricsChartOptions } from './chartOptions';

export const MetricsChart = ({ history, population }: { history: MetricPoint[], population: number }) => {
  const option = useMemo(() => getMetricsChartOptions(history), [history]);

  return (
    <div className="h-full flex flex-col pb-2">
      <div className="flex-1 min-h-0">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge={false} lazyUpdate={true} />
      </div>
      <div className="flex flex-wrap justify-around text-[10px] mt-2 font-bold tracking-wider uppercase gap-y-1">
        <span className="text-emerald-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Pop ({population})
        </span>
        <span className="text-amber-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          Food ({history[history.length - 1]?.food || 0})
        </span>
        <span className="text-blue-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          Speed
        </span>
        <span className="text-rose-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          Aggro
        </span>
        <span className="text-purple-500 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          Age
        </span>
        <span className="text-teal-500 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          Health
        </span>
      </div>
    </div>
  );
};
