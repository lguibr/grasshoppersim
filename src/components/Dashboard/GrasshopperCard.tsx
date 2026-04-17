import React from "react";
import { CricketStat } from "../../store";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const GrasshopperCard = React.memo(
  ({
    stat,
    isFollowed,
    onFollow,
  }: {
    stat: CricketStat;
    isFollowed: boolean;
    onFollow: (id: number) => void;
  }) => {
    const isOvercharged = stat.health > 100;

    return (
      <div
        onClick={() => onFollow(stat.id)}
        className={`group relative px-2 py-0.5 rounded-sm cursor-pointer transition-all duration-200 border flex items-center justify-between gap-2 overflow-hidden ${
          isFollowed
            ? "bg-slate-800/90 border-emerald-500/50 shadow-[0_0_10px_-2px_rgba(16,185,129,0.2)]"
            : "bg-slate-900/40 border-transparent hover:bg-slate-800/60 hover:border-slate-700"
        }`}
      >
        {isFollowed && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
        )}

        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs leading-none">
            {stat.isBaby ? "👶" : "🦗"}
          </span>
          <div className="flex flex-col min-w-0">
            <span
              className="font-mono text-[10px] font-bold text-slate-300 truncate"
              title={stat.name}
            >
              {stat.name}
            </span>
            <span className="text-[8px] text-slate-500 truncate">
              Age: {Math.floor((Date.now() - stat.birthTime) / 1000)}s
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Tooltip>
            <TooltipTrigger
              render={<div className="w-8 flex items-center cursor-help" />}
            >
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-300 ${stat.health > 50 ? "bg-emerald-500" : "bg-rose-500"}`}
                  style={{ width: `${Math.min(100, stat.health)}%` }}
                />
                {isOvercharged && (
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${stat.health - 100}%` }}
                  />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Energy: {Math.round(stat.health)}%</p>
            </TooltipContent>
          </Tooltip>

          <MiniTrait
            color="bg-amber-400"
            value={stat.traits.speed}
            tooltip="Speed"
          />
          <MiniTrait
            color="bg-rose-400"
            value={stat.traits.aggressiveness}
            tooltip="Aggressiveness"
          />

          <div
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{
              backgroundColor:
                stat.action === "fighting"
                  ? "#f87171"
                  : stat.action === "eating"
                    ? "#34d399"
                    : stat.action === "hunting"
                      ? "#fbbf24"
                      : "#94a3b8",
            }}
          />
        </div>
      </div>
    );
  },
);

const MiniTrait = ({
  color,
  value,
  tooltip,
}: {
  color: string;
  value: number;
  tooltip: string;
}) => (
  <Tooltip>
    <TooltipTrigger
      render={
        <div className="w-6 h-1.5 bg-slate-950 rounded-full overflow-hidden cursor-help" />
      }
    >
      <div
        className={`h-full ${color}`}
        style={{ width: `${Math.min(100, value * 100)}%` }}
      />
    </TooltipTrigger>
    <TooltipContent>
      <p>
        {tooltip}: {Math.round(value * 100)}%
      </p>
    </TooltipContent>
  </Tooltip>
);
