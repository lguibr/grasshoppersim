import React, { useState, useEffect } from "react";
import { Slider } from "../ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const ControlSlider = ({
  icon,
  label,
  value,
  min,
  max,
  step,
  onChange,
  tooltip,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  tooltip: string;
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (typeof value === "number" && !isNaN(value)) {
      setLocalValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (
        localValue !== value &&
        typeof localValue === "number" &&
        !isNaN(localValue)
      ) {
        onChange(localValue);
      }
    }, 200);
    return () => clearTimeout(handler);
  }, [localValue, value, onChange]);

  return (
    <div className="space-y-1.5 flex flex-col justify-end">
      <div className="flex justify-between items-center px-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <label className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-help" />
            }
          >
            {icon}
            <span className="truncate max-w-[80px]">{label}</span>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-slate-950 border-emerald-500/50 rounded-none text-emerald-400 font-mono text-[10px]">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
        <span className="text-emerald-400 font-mono text-[11px] font-bold bg-slate-950/80 px-1 border border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.3)]">
          {localValue}
        </span>
      </div>
      <Slider
        value={[localValue]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals: any) => {
          const val = Array.isArray(vals) ? vals[0] : vals;
          if (typeof val === "number" && !isNaN(val)) {
            setLocalValue(val);
          }
        }}
        className="py-1"
      />
    </div>
  );
};
