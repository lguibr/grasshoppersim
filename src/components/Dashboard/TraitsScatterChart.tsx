import React, { useMemo, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import "echarts-gl";
import { CricketStat } from "../../store";

export const TraitsScatterChart = ({ stats }: { stats: CricketStat[] }) => {
  const chartRef = useRef<ReactECharts>(null);
  const statsRef = useRef(stats);
  statsRef.current = stats;

  const baseOption = useMemo(() => {
    return {
      backgroundColor: "transparent",
      animation: false,
      tooltip: {
        backgroundColor: "#0f172a",
        borderColor: "#1e293b",
        textStyle: { color: "#f8fafc", fontSize: 12 },
        formatter: (params: any) => {
          const d = params.data;
          if (!d) return "";
          return `ID: ${d[4]}<br/>Name: ${d[6]}<br/>Age: ${d[5].toFixed(1)}s<br/>Jump Dist: ${d[0].toFixed(2)}<br/>Jump Height: ${d[1].toFixed(2)}<br/>Speed: ${d[2].toFixed(2)}<br/>Aggro: ${d[3].toFixed(2)}`;
        },
      },
      visualMap: [
        {
          type: "continuous",
          dimension: 3, // Aggressiveness
          min: 0,
          max: 1,
          inRange: {
            color: ["#3b82f6", "#22c55e", "#eab308", "#ef4444"], // Blue -> Green -> Yellow -> Red
          },
          show: false,
        },
        {
          type: "continuous",
          dimension: 5, // Age
          min: 0,
          max: 60, // Scale up to 60 seconds
          inRange: {
            colorAlpha: [0.1, 1],
          },
          show: false,
        },
      ],
      xAxis3D: {
        type: "value",
        min: -2.2,
        max: 2.2,
        name: "",
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { show: false },
      },
      yAxis3D: {
        type: "value",
        min: -2.2,
        max: 2.2,
        name: "",
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { show: false },
      },
      zAxis3D: {
        type: "value",
        min: -2.2,
        max: 2.2,
        name: "",
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { show: false },
      },
      grid3D: {
        boxWidth: 100,
        boxHeight: 100,
        boxDepth: 100,
        show: false,
        viewControl: {
          projection: "perspective",
          autoRotate: false,
          autoRotateSpeed: 10,
          distance: 140,
          alpha: 20,
          beta: 40,
          zoomSensitivity: 1,
          panSensitivity: 1,
          rotateSensitivity: 1,
        },
      },
      series: [
        {
          type: "scatter3D",
          symbolSize: 8,
          data: [],
          animation: false,
        },
        {
          type: "line3D",
          data: [[0, 0, 0], [2.2, 0, 0]],
          lineStyle: { width: 3, color: "#94a3b8" },
          animation: false,
        },
        {
          type: "line3D",
          data: [[0, 0, 0], [0, 2.2, 0]],
          lineStyle: { width: 3, color: "#94a3b8" },
          animation: false,
        },
        {
          type: "line3D",
          data: [[0, 0, 0], [0, 0, 2.2]],
          lineStyle: { width: 3, color: "#94a3b8" },
          animation: false,
        },
      ],
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const echart = chartRef.current?.getEchartsInstance();
      if (echart) {
        const now = Date.now();
        const data = statsRef.current.map((stat) => [
          stat.traits.jumpDistance,
          stat.traits.jumpHeight,
          stat.traits.speed,
          stat.traits.aggressiveness,
          stat.id,
          (now - stat.birthTime) / 1000,
          stat.name,
        ]);
        echart.setOption({
          series: [
            {
              data: data,
            },
          ],
        });
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-1 left-2 z-10 flex flex-col text-[8px] font-black tracking-widest uppercase text-slate-500 opacity-60">
        <span>X: Jump Dist</span>
        <span>Y: Jump Hgt</span>
        <span>Z: Speed</span>
        <span>Color: Agr</span>
        <span>Alpha: Age</span>
      </div>
      <ReactECharts
          ref={chartRef}
          option={baseOption}
          style={{ height: "100%", width: "100%" }}
        />
    </div>
  );
};
