import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import 'echarts-gl';
import { CricketStat } from '../../store';

export const TraitsScatterChart = ({ stats }: { stats: CricketStat[] }) => {
  const option = useMemo(() => {
    const now = Date.now();
    const data = stats.map(stat => [
      stat.traits.jumpDistance,
      stat.traits.jumpHeight,
      stat.traits.speed,
      stat.traits.aggressiveness,
      stat.id,
      (now - stat.birthTime) / 1000, // Age in seconds
      stat.name
    ]);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#1e293b',
        textStyle: { color: '#f8fafc', fontSize: 12 },
        formatter: (params: any) => {
          const d = params.data;
          return `ID: ${d[4]}<br/>Name: ${d[6]}<br/>Age: ${d[5].toFixed(1)}s<br/>Jump Dist: ${d[0].toFixed(2)}<br/>Jump Height: ${d[1].toFixed(2)}<br/>Speed: ${d[2].toFixed(2)}<br/>Aggro: ${d[3].toFixed(2)}`;
        }
      },
      visualMap: [
        {
          type: 'continuous',
          dimension: 3, // Aggressiveness
          min: 0,
          max: 1,
          inRange: {
            color: ['#3b82f6', '#22c55e', '#eab308', '#ef4444'] // Blue -> Green -> Yellow -> Red
          },
          show: false
        },
        {
          type: 'continuous',
          dimension: 5, // Age
          min: 0,
          max: 60, // Scale up to 60 seconds
          inRange: {
            colorAlpha: [0.1, 1]
          },
          show: false
        }
      ],
      xAxis3D: {
        type: 'value',
        name: 'Jump Dist',
        min: 0,
        max: 2,
        nameTextStyle: { color: '#94a3b8', fontSize: 10 },
        axisLabel: { textStyle: { color: '#475569', fontSize: 10 } },
        axisLine: { lineStyle: { color: '#64748b', width: 2 } },
        splitLine: { show: false }
      },
      yAxis3D: {
        type: 'value',
        name: 'Jump Height',
        min: 0,
        max: 2,
        nameTextStyle: { color: '#94a3b8', fontSize: 10 },
        axisLabel: { textStyle: { color: '#475569', fontSize: 10 } },
        axisLine: { lineStyle: { color: '#64748b', width: 2 } },
        splitLine: { show: false }
      },
      zAxis3D: {
        type: 'value',
        name: 'Speed',
        min: 0,
        max: 2,
        nameTextStyle: { color: '#94a3b8', fontSize: 10 },
        axisLabel: { textStyle: { color: '#475569', fontSize: 10 } },
        axisLine: { lineStyle: { color: '#64748b', width: 2 } },
        splitLine: { show: false }
      },
      grid3D: {
        boxWidth: 100,
        boxHeight: 100,
        boxDepth: 100,
        top: -20,
        bottom: -20,
        viewControl: {
          projection: 'perspective',
          autoRotate: true,
          autoRotateSpeed: 10,
          distance: 180,
          alpha: 20,
          beta: 40,
          zoomSensitivity: 1,
          panSensitivity: 1,
          rotateSensitivity: 1
        },
        axisLine: { lineStyle: { color: '#64748b' } },
        splitLine: { show: false },
        axisPointer: { show: false }
      },
      series: [
        {
          type: 'scatter3D',
          symbolSize: 8,
          data: data,
          animation: false
        }
      ]
    };
  }, [stats]);

  return (
    <div className="h-full flex flex-col pb-2 relative">
      <div className="flex-1 min-h-0">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge={false} lazyUpdate={true} />
      </div>
      <div className="flex flex-wrap justify-center text-[10px] mt-2 font-bold tracking-wider uppercase text-slate-500 gap-x-4 gap-y-1">
        <span>X: Jump Dist</span>
        <span>Y: Jump Height</span>
        <span>Z: Speed</span>
        <span>Color: Aggro</span>
        <span>Opacity: Age</span>
      </div>
    </div>
  );
};
