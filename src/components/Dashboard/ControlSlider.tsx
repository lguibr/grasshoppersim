import React, { useState, useEffect } from 'react';
import { Slider } from '../ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export const ControlSlider = ({
    icon, label, value, min, max, step, onChange, tooltip
}: {
    icon: React.ReactNode, label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void, tooltip: string
}) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        if (typeof value === 'number' && !isNaN(value)) {
            setLocalValue(value);
        }
    }, [value]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (localValue !== value && typeof localValue === 'number' && !isNaN(localValue)) {
                onChange(localValue);
            }
        }, 200);
        return () => clearTimeout(handler);
    }, [localValue, value, onChange]);

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <Tooltip>
                    <TooltipTrigger render={
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider cursor-help" />
                    }>
                        {icon}
                        <span>{label}</span>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
                <span className="text-emerald-400 font-mono text-sm font-bold">{localValue}</span>
            </div>
            <Slider
                value={[localValue]}
                min={min}
                max={max}
                step={step}
                onValueChange={(vals: any) => {
                    const val = Array.isArray(vals) ? vals[0] : vals;
                    if (typeof val === 'number' && !isNaN(val)) {
                        setLocalValue(val);
                    }
                }}
                className="py-1"
            />
        </div>
    );
};
