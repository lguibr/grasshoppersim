import React, { useMemo } from "react";
import { CricketStat } from "../../store";
import {
  Activity,
  FastForward,
  ArrowUpCircle,
  ShieldAlert,
} from "lucide-react";

export const BehaviorTable = ({ stats }: { stats: CricketStat[] }) => {
  const averages = useMemo(() => {
    if (stats.length === 0) return { jump: 0, speed: 0, height: 0, aggro: 0 };
    const sum = stats.reduce(
      (acc, curr) => {
        acc.jump += curr.traits.jumpDistance;
        acc.speed += curr.traits.speed;
        acc.height += curr.traits.jumpHeight;
        acc.aggro += curr.traits.aggressiveness;
        return acc;
      },
      { jump: 0, speed: 0, height: 0, aggro: 0 },
    );

    return {
      jump: sum.jump / stats.length,
      speed: sum.speed / stats.length,
      height: sum.height / stats.length,
      aggro: sum.aggro / stats.length,
    };
  }, [stats]);

  return (
    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 h-full flex flex-col">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Activity size={14} />
        Average Traits
      </h3>
      <div className="flex-1 flex flex-col justify-around gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <ArrowUpCircle size={14} className="text-blue-400" />
            <span>Jump Dist</span>
          </div>
          <span className="font-bold text-blue-400 font-mono">
            {(averages.jump * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <FastForward size={14} className="text-amber-400" />
            <span>Speed</span>
          </div>
          <span className="font-bold text-amber-400 font-mono">
            {(averages.speed * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Activity size={14} className="text-purple-400" />
            <span>Jump Hgt</span>
          </div>
          <span className="font-bold text-purple-400 font-mono">
            {(averages.height * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <ShieldAlert size={14} className="text-rose-400" />
            <span>Aggro</span>
          </div>
          <span className="font-bold text-rose-400 font-mono">
            {(averages.aggro * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};
