import React from 'react';
import { Activity } from 'lucide-react';
import { MetricsChart } from './MetricsChart';
import { TraitsScatterChart } from './TraitsScatterChart';

export const EcosystemMetrics = ({ history, stats }: { history: any[], stats: any[] }) => {
    return (
        <>
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between shrink-0">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} />
                    Ecosystem Metrics
                </h2>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 border-b border-slate-800 p-4 min-h-0">
                    <MetricsChart history={history} population={stats.length} />
                </div>
                <div className="flex-1 p-4 min-h-0">
                    <TraitsScatterChart stats={stats} />
                </div>
            </div>
        </>
    );
};
