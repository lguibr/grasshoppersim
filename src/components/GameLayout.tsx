import React, { useState, useEffect } from 'react';
import { useSimulationStore, SimulationState } from '../store';
import { Users, Leaf, Play, Pause, RotateCcw } from 'lucide-react';
import { GrasshopperList } from './Dashboard/GrasshopperList';
import { useSettings } from '../context/SettingsContext';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { EcosystemMetrics } from './Dashboard/EcosystemMetrics';
import { SimulationControls } from './Dashboard/SimulationControls';

export const GameLayout = ({ children }: { children: React.ReactNode }) => {
  const [simState, setSimState] = useState<SimulationState>(useSimulationStore.simulationState);
  const [stats, setStats] = useState(Array.from(useSimulationStore.stats.values()));
  const [history, setHistory] = useState(useSimulationStore.history);
  const [followedId, setFollowedId] = useState<number | null>(useSimulationStore.followedId);
  const { triggerReset } = useSettings();

  useEffect(() => {
    const unsub = useSimulationStore.subscribe(() => {
      setSimState(useSimulationStore.simulationState);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (simState === 'setup') return;
    const interval = setInterval(() => {
      setStats(Array.from(useSimulationStore.stats.values()));
      setHistory([...useSimulationStore.history]);
      setFollowedId(useSimulationStore.followedId);
    }, 500);
    return () => clearInterval(interval);
  }, [simState]);

  const handleFollow = (id: number) => {
    if (followedId === id) {
      useSimulationStore.setFollowedId(null);
    } else {
      useSimulationStore.setFollowedId(id);
    }
  };

  const handlePlayPause = () => {
    if (simState === 'setup' || simState === 'paused') {
      useSimulationStore.setSimulationState('running');
    } else {
      useSimulationStore.setSimulationState('paused');
    }
  };

  const handleRestart = () => {
    useSimulationStore.setSimulationState('setup');
    triggerReset();
  };

  if (simState === 'setup') {
    return <>{children}</>;
  }

  const currentFood = history.length > 0 ? history[history.length - 1].food : 0;

  return (
    <div className="w-screen h-screen bg-slate-950 flex flex-col font-sans text-slate-200 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Roster */}
        <aside className="w-72 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 z-20 shadow-lg">
          <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-col gap-4">
            <div className="flex items-center justify-between bg-slate-950/50 px-4 py-3 rounded-xl border border-slate-800 shadow-inner">
              <Tooltip>
                <TooltipTrigger render={<div className="flex flex-col items-center gap-1 text-emerald-400 cursor-help" />}>
                  <Users size={18} />
                  <span className="font-bold font-mono text-xl">{stats.length}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current Population</p>
                </TooltipContent>
              </Tooltip>

              <div className="w-px h-8 bg-slate-700"></div>

              <Tooltip>
                <TooltipTrigger render={<div className="flex flex-col items-center gap-1 text-amber-400 cursor-help" />}>
                  <Leaf size={18} />
                  <span className="font-bold font-mono text-xl">{currentFood}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Available Food</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Users size={14} />
              Population Roster
            </h2>
          </div>
          <div className="flex-1 overflow-hidden p-2">
            <GrasshopperList stats={stats} followedId={followedId} onFollow={handleFollow} />
          </div>
        </aside>

        {/* Middle Content: Canvas */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
          {/* Floating Controls */}
          <div className="absolute top-4 right-4 z-30 flex gap-2">
            <Tooltip>
              <TooltipTrigger render={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                  className={`flex items-center justify-center gap-2 font-bold transition-colors shadow-lg backdrop-blur-sm ${simState === 'running'
                      ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border-amber-500/30 hover:text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-emerald-500/30 hover:text-emerald-400'
                    }`}
                />
              }>
                {simState === 'running' ? <><Pause size={14} /> PAUSE</> : <><Play size={14} /> RESUME</>}
              </TooltipTrigger>
              <TooltipContent>
                <p>{simState === 'running' ? 'Pause the simulation' : 'Resume the simulation'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger render={
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRestart}
                  className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700 shadow-lg backdrop-blur-sm"
                />
              }>
                <RotateCcw size={16} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Restart Simulation & Show Controls</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* 3D Canvas Container */}
          <div className="flex-1 relative">
            {children}
          </div>
        </main>

        {/* Right Sidebar: Metrics & Controls */}
        <aside className="w-[400px] bg-slate-900/95 border-l border-slate-800 flex flex-col shrink-0 z-20 shadow-lg">
          {simState === 'running' ? (
            <EcosystemMetrics history={history} stats={stats} />
          ) : (
            <SimulationControls />
          )}
        </aside>
      </div>
    </div>
  );
};
