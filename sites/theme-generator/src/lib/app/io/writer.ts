import boilerplate from "./boilerplate.txt?raw";

import { colorPairings, colorShades } from "../constants";
import type { DeepReadonly } from "../utils";
import type { ThemetteTheme } from "../types";

/** the object returned from `writeTheme` */
type WriteThemeReturn = {
  raw: string;
  css: string;
};

/**
 * converts a `ThemetteTheme` to it's css counterpart (raw and boilerplated).
 *
 * Note that this function can take on "dirty" state that wasn't snapshotted. We make sure
 * not to do any mutation. I am unsure if there is any performance benefit to doing this.
 */
export function writeTheme(theme: DeepReadonly<ThemetteTheme>): WriteThemeReturn {
  let colors = "";
  let contrasts = "";

  let pairs = "";
  let contrastPairs = "";

  for (let set of theme) {
    const key = set.name;

    for (let shade of colorShades) {
      const v = set[shade];
      const cv = set.contrasts[shade];

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

  const raw = colors + contrasts;
  return {
    raw,
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
