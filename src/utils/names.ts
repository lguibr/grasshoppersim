const FIRST_NAMES = [
  "Jumpy",
  "Hoppy",
  "Leap",
  "Bounce",
  "Spring",
  "Kick",
  "Dash",
  "Zip",
  "Zoom",
  "Dart",
  "Flip",
  "Skip",
  "Bound",
  "Vault",
  "Pogo",
  "Cricket",
  "Locust",
  "Buggy",
  "Snappy",
  "Chirp",
];
const LAST_NAMES = [
  "Green",
  "Leaf",
  "Blade",
  "Grass",
  "Stem",
  "Root",
  "Vine",
  "Bush",
  "Tree",
  "Wood",
  "Bark",
  "Twig",
  "Moss",
  "Fern",
  "Weed",
  "Reed",
  "Rush",
  "Sedge",
  "Shrub",
  "Plant",
];

const nameCounts = new Map<string, number>();

function toRoman(num: number): string {
  if (num <= 1) return "";
  const roman = ["", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return roman[num - 1] || num.toString();
}

export function generateName(parentLastName?: string): {
  firstName: string;
  lastName: string;
  fullName: string;
} {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName =
    parentLastName || LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const baseName = `${firstName} ${lastName}`;

  const count = (nameCounts.get(baseName) || 0) + 1;
  nameCounts.set(baseName, count);

  const suffix = toRoman(count);
  const fullName = suffix ? `${baseName} ${suffix}` : baseName;

  return { firstName, lastName, fullName };
}
