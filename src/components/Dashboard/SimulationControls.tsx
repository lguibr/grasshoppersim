import React from 'react';
import { Settings as SettingsIcon, HeartPulse, Maximize, Apple, Timer, Users, Swords, Activity } from 'lucide-react';
import { Separator } from '../ui/separator';
import { ControlSlider } from './ControlSlider';
import { useSettings } from '../../context/SettingsContext';

export const SimulationControls = () => {
    const { settings, updateSetting } = useSettings();

    return (
        <>
            <div className="p-4 border-b border-slate-800 bg-slate-900 shrink-0">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <SettingsIcon size={14} />
                    Simulation Controls
                </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                <ControlSlider
                    icon={<HeartPulse size={16} className="text-rose-400" />}
                    label="Health Decay"
                    value={settings.healthDecay}
                    min={0.1} max={10} step={0.1}
                    onChange={(v) => updateSetting('healthDecay', v)}
                    tooltip="How fast grasshoppers lose health over time."
                />
                <Separator className="bg-slate-800" />

                <ControlSlider
                    icon={<Maximize size={16} className="text-blue-400" />}
                    label="Environment Size"
                    value={settings.envSize}
                    min={24} max={500} step={1}
                    onChange={(v) => {
                        updateSetting('envSize', v);
                        import('../../utils/terrain').then(m => m.setEnvSize(v));
                    }}
                    tooltip="The total area of the simulation."
                />
                <Separator className="bg-slate-800" />

                <ControlSlider
                    icon={<Apple size={16} className="text-emerald-400" />}
                    label="Max Food"
                    value={settings.maxFood}
                    min={10} max={500} step={10}
                    onChange={(v) => updateSetting('maxFood', v)}
                    tooltip="Maximum amount of food that can exist at once."
                />
                <Separator className="bg-slate-800" />

                <ControlSlider
                    icon={<Timer size={16} className="text-amber-400" />}
                    label="Food Spawn Rate (ms)"
                    value={settings.foodSpawnRate}
                    min={100} max={5000} step={100}
                    onChange={(v) => updateSetting('foodSpawnRate', v)}
                    tooltip="How often new food spawns."
                />
                <Separator className="bg-slate-800" />

                <ControlSlider
                    icon={<Users size={16} className="text-indigo-400" />}
                    label="Initial Grasshoppers"
                    value={settings.initialGrasshoppers}
                    min={10} max={500} step={10}
                    onChange={(v) => updateSetting('initialGrasshoppers', v)}
                    tooltip="Starting population size."
                />
                <Separator className="bg-slate-800" />

                <ControlSlider
                    icon={<Swords size={16} className="text-purple-400" />}
                    label="Fight Lifesteal (%)"
                    value={settings.fightLifesteal}
                    min={0} max={100} step={1}
                    onChange={(v) => updateSetting('fightLifesteal', v)}
                    tooltip="Percentage of health stolen when winning a fight."
                />
                <Separator className="bg-slate-800" />

                <ControlSlider
                    icon={<Activity size={16} className="text-cyan-400" />}
                    label="Water Level"
                    value={settings.waterLevel}
                    min={-50} max={50} step={1}
                    onChange={(v) => updateSetting('waterLevel', v)}
                    tooltip="Height of the water plane. Grasshoppers decay faster underwater."
                />
                <Separator className="bg-slate-800" />

                <ControlSlider
                    icon={<Activity size={16} className="text-orange-400" />}
                    label="Terrain Roughness"
                    value={settings.terrainRoughness}
                    min={0} max={100} step={1}
                    onChange={(v) => {
                        updateSetting('terrainRoughness', v);
                        import('../../utils/terrain').then(m => m.setTerrainRoughness(v));
                    }}
                    tooltip="How bumpy the terrain is."
                />
            </div>
        </>
    );
};
