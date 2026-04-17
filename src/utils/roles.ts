import { GrasshopperTraits } from "../types";

export const getGrasshopperRole = (traits: GrasshopperTraits): string => {
  const { jumpDistance, jumpHeight, speed, aggressiveness } = traits;

  if (aggressiveness > 0.8) return "Fighter";
  if (jumpHeight > 1.1 && jumpDistance > 1.1) return "Flyer";
  if (speed > 1.1) return "Explorer";
  if (jumpDistance < 0.9 && speed < 0.9) return "Sluggish";
  if (aggressiveness < 0.2) return "Pacifist";

  return "Balanced";
};
