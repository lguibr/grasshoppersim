import React, { useState, useEffect, useRef } from "react";
import { useSimulationStore, SimulationState } from "../store";
import { Users, Leaf, Play, Pause, RotateCcw } from "lucide-react";
import { GrasshopperList } from "./Dashboard/GrasshopperList";
import { useSettings } from "../context/SettingsContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { EcosystemMetrics } from "./Dashboard/EcosystemMetrics";
import { SimulationControls } from "./Dashboard/SimulationControls";

export const GameLayout = ({ children }: { children: React.ReactNode }) => {
  const [simState, setSimState] = useState<SimulationState>(
    useSimulationStore.simulationState,
  );
  const [stats, setStats] = useState(
    Array.from(useSimulationStore.stats.values()),
  );
  const [history, setHistory] = useState(useSimulationStore.history);
  const [followedId, setFollowedId] = useState<number | null>(
    useSimulationStore.followedId,
  );
  const [topHeight, setTopHeight] = useState(60);
  const [sidebarWidth, setSidebarWidth] = useState(600);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  const handleDragDivider = (e: React.MouseEvent) => {
    e.preventDefault();
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    const rect = sidebar.getBoundingClientRect();

    const onMouseMove = (moveEvent: MouseEvent) => {
      const percentage = ((moveEvent.clientY - rect.top) / rect.height) * 100;
      setTopHeight(Math.max(20, Math.min(80, percentage)));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleDragWidth = (e: React.MouseEvent) => {
    e.preventDefault();
    const onMouseMove = (moveEvent: MouseEvent) => {
      setSidebarWidth(Math.max(300, Math.min(1200, moveEvent.clientX)));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  useEffect(() => {
    const unsub = useSimulationStore.subscribe(() => {
      setSimState(useSimulationStore.simulationState);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (simState === "setup") return;
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
    if (simState === "setup" || simState === "paused") {
      useSimulationStore.setSimulationState("running");
    } else {
      useSimulationStore.setSimulationState("paused");
    }
  };

  const handleRestart = () => {
    useSimulationStore.setSimulationState("setup");
    triggerReset();
  };

  if (simState === "setup") {
    return <>{children}</>;
  }

  const currentFood = history.length > 0 ? history[history.length - 1].food : 0;

  return (
    <div className="w-screen h-screen bg-slate-950 flex flex-col font-sans text-slate-200 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Combined Dashboard */}
        <aside 
          className="bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 z-20 shadow-lg relative transition-opacity duration-300"
          style={{ 
            opacity: settings.uiOpacity !== undefined ? settings.uiOpacity / 100 : 1,
            width: `${sidebarWidth}px`
          }}
        >
          <div ref={sidebarRef} className="flex flex-col flex-1 overflow-hidden">
            {/* Top Half: Roster (Larger) */}
            <div 
              style={{ height: `${topHeight}%` }}
              className="flex flex-col overflow-hidden min-h-0 bg-slate-900/50"
            >
              <div className="p-3 border-b border-slate-800 bg-slate-900 flex flex-col gap-3 shrink-0">
                <div className="flex items-center justify-around bg-slate-950/50 px-3 py-2 rounded-lg border border-slate-800 shadow-inner">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <div className="flex flex-col items-center gap-0.5 text-emerald-400 cursor-help" />
                      }
                    >
                      <Users size={18} />
                      <span className="font-bold font-mono text-lg leading-none">
                        {stats.length}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Current Population</p>
                    </TooltipContent>
                  </Tooltip>

                  <div className="w-px h-8 bg-slate-700"></div>

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <div className="flex flex-col items-center gap-0.5 text-amber-400 cursor-help" />
                      }
                    >
                      <Leaf size={18} />
                      <span className="font-bold font-mono text-lg leading-none">
                        {currentFood}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Available Food</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Users size={12} />
                  Population Roster
                </h2>
              </div>
              <div className="flex-1 overflow-hidden p-2">
                <GrasshopperList
                  stats={stats}
                  followedId={followedId}
                  onFollow={handleFollow}
                />
              </div>
            </div>

            {/* Draggable Divider */}
            <div
              onMouseDown={handleDragDivider}
              className="h-1.5 w-full bg-slate-800 cursor-row-resize hover:bg-emerald-500/50 transition-colors z-50 shrink-0"
              title="Drag to resize"
            />

            {/* Bottom Half: Metrics (Smaller) */}
            <div 
              style={{ height: `${100 - topHeight}%` }}
              className="flex flex-col overflow-hidden min-h-0"
            >
              {simState === "running" ? (
                <EcosystemMetrics history={history} stats={stats} />
              ) : (
                <SimulationControls />
              )}
            </div>
          </div>
        </aside>

        {/* Sidebar Vertical Resizer */}
        <div
          onMouseDown={handleDragWidth}
          className="w-1.5 bg-slate-800 cursor-col-resize hover:bg-emerald-500/50 transition-colors z-50 shrink-0"
          title="Drag to resize width"
        />

        {/* Middle Content: Canvas */}
        <main className="flex-1 flex flex-col relative z-0 overflow-hidden bg-slate-950">
          {/* Floating Controls */}
          <div className="absolute top-4 right-4 z-30 flex gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePlayPause}
                    className={`flex items-center justify-center gap-2 font-bold transition-colors shadow-lg backdrop-blur-sm ${
                      simState === "running"
                        ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border-amber-500/30 hover:text-amber-400"
                        : "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-emerald-500/30 hover:text-emerald-400"
                    }`}
                  />
                }
              >
                {simState === "running" ? (
                  <>
                    <Pause size={14} /> PAUSE
                  </>
                ) : (
                  <>
                    <Play size={14} /> RESUME
                  </>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {simState === "running"
                    ? "Pause the simulation"
                    : "Resume the simulation"}
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRestart}
                    className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700 shadow-lg backdrop-blur-sm"
                  />
                }
              >
                <RotateCcw size={16} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Restart Simulation & Show Controls</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* 3D Canvas Container */}
          <div className="flex-1 relative">{children}</div>
        </main>

        {/* Right Sidebar entirely removed as requested */}
      </div>
    </div>
  );
};
