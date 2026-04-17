import React, { createContext, useContext, useState } from "react";
import { SimulationSettings } from "../types";

export const defaultSettings: SimulationSettings = {
  healthDecay: 1,
  envSize: 250,
  maxFood: 300,
  foodSpawnRate: 200,
  initialGrasshoppers: 20,
  fightLifesteal: 50,
  waterLevel: -12,
  terrainRoughness: 20,
  uiOpacity: 100,
};

interface SettingsContextType {
  settings: SimulationSettings;
  updateSetting: (key: keyof SimulationSettings, value: number) => void;
  resetTrigger: number;
  triggerReset: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SimulationSettings>(defaultSettings);
  const [resetTrigger, setResetTrigger] = useState(0);

  const updateSetting = (key: keyof SimulationSettings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const triggerReset = () => {
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSetting, resetTrigger, triggerReset }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within a SettingsProvider");
  return context;
};
