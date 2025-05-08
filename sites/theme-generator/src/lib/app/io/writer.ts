import { colorPairings, colorShades } from "../constants";
import type { ThemetteTheme } from "../types";
import boilerplate from "./boilerplate.txt?raw";

export function writeTheme(theme: ThemetteTheme): {
  css: string;
  raw: string;
} {
  const keys = Object.keys(theme);

  let colors = "";
  let contrasts = "";

  let pairs = "";
  let contrastPairs = "";

  for (let key of keys) {
    for (let shade of colorShades) {
      const v = theme[key][shade];
      const cv = theme[key].contrasts[shade];
      colors += color(key, shade, v);
      contrasts += contrast(key, shade, cv);
    }

    for (let [light, dark] of colorPairings) {
      pairs += pair(key, light, dark);
      contrastPairs += contrastPair(key, light, dark);
    }

    // add a new line for each set
    colors += "\n";
    contrasts += "\n";
    pairs += "\n";
    contrastPairs += "\n";
  }

  return {
    // we do not need to add the pairs and contrast pairs.
    raw: colors + contrasts,
    css: boilerplate
      .replace("$$colors$$", colors.trim())
      .replace("$$contrasts$$", contrasts.trim())
      .replace("$$pairs$$", pairs.trim())
      .replace("$$contrast-pairs$$", contrastPairs.trim()),
  };
}

function color(set: string, shade: string, val: string) {
  return `  --color-${set}-${shade}: ${val};\n`;
}

function contrast(set: string, shade: string, val: string) {
  return `  --color-${set}-contrast-${shade}: ${val};\n`;
}

function pair(set: string, light: string, dark: string) {
  return `  --color-${set}-${light}-${dark}: light-dark(var(--color-${set}-${light}), var(--color-${set}-${dark}));\n`;
}
function contrastPair(set: string, light: string, dark: string) {
  return `  --color-${set}-contrast-${light}-${dark}: light-dark(var(--color-${set}-contrast-${light}), var(--color-${set}-contrast-${dark}));\n`;
}
