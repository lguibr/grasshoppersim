import React from "react";
import {
  Settings as SettingsIcon,
  HeartPulse,
  Maximize,
  Apple,
  Timer,
  Users,
  Swords,
  Activity,
  Eye,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { ControlSlider } from "./ControlSlider";
import { useSettings } from "../../context/SettingsContext";
import { setEnvSize, setTerrainRoughness } from "../../utils/terrain";

export const SimulationControls = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <>
      <div className="p-4 border-b border-slate-800 bg-slate-950 shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
        <h2 className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
          <SettingsIcon size={14} className="animate-spin-slow" />
          Simulation Controls
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 gap-x-4 gap-y-6 grid grid-cols-2 custom-scrollbar content-start">
        <ControlSlider
          icon={<HeartPulse size={14} className="text-rose-400" />}
          label="Decay"
          value={settings.healthDecay}
          min={0.1}
          max={10}
          step={0.1}
          onChange={(v) => updateSetting("healthDecay", v)}
          tooltip="Health loss over time"
        />

        <ControlSlider
          icon={<Maximize size={14} className="text-blue-400" />}
          label="Size"
          value={settings.envSize}
          min={24}
          max={500}
          step={1}
          onChange={(v) => {
            updateSetting("envSize", v);
            setEnvSize(v);
          }}
          tooltip="Simulation scale"
        />

        <ControlSlider
          icon={<Apple size={14} className="text-emerald-400" />}
          label="Max Food"
          value={settings.maxFood}
          min={10}
          max={500}
          step={10}
          onChange={(v) => updateSetting("maxFood", v)}
          tooltip="Max food count"
        />

        <ControlSlider
          icon={<Timer size={14} className="text-amber-400" />}
          label="Spawn (ms)"
          value={settings.foodSpawnRate}
          min={100}
          max={5000}
          step={100}
          onChange={(v) => updateSetting("foodSpawnRate", v)}
          tooltip="Food spawn frequency"
        />

        <ControlSlider
          icon={<Users size={14} className="text-indigo-400" />}
          label="Init Pop"
          value={settings.initialGrasshoppers}
          min={10}
          max={500}
          step={10}
          onChange={(v) => updateSetting("initialGrasshoppers", v)}
          tooltip="Starting crickets"
        />

        <ControlSlider
          icon={<Swords size={14} className="text-purple-400" />}
          label="Lifesteal %"
          value={settings.fightLifesteal}
          min={0}
          max={100}
          step={1}
          onChange={(v) => updateSetting("fightLifesteal", v)}
          tooltip="Combat healing"
        />

        <ControlSlider
          icon={<Activity size={14} className="text-cyan-400" />}
          label="Water Lvl"
          value={settings.waterLevel}
          min={-50}
          max={50}
          step={1}
          onChange={(v) => updateSetting("waterLevel", v)}
          tooltip="Ocean height"
        />

        <ControlSlider
          icon={<Activity size={14} className="text-orange-400" />}
          label="Roughness"
          value={settings.terrainRoughness}
          min={0}
          max={100}
          step={1}
          onChange={(v) => {
            updateSetting("terrainRoughness", v);
            setTerrainRoughness(v);
          }}
          tooltip="Terrain noise"
        />

        <ControlSlider
          icon={<Eye size={14} className="text-pink-400" />}
          label="UI Opacity"
          value={settings.uiOpacity}
          min={0}
          max={100}
          step={1}
          onChange={(v) => updateSetting("uiOpacity", v)}
          tooltip="Dashboard Alpha"
        />
      </div>
    </>
  );
};
