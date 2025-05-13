import { nanoid } from "nanoid";
import { colorShades } from "../constants";
import type { ColorSet, ColorShadeObject, ColorShade, ThemetteTheme } from "../types";

/**
 * Converts a css string to a `ThemetteTheme` if possible, throws an error if it fails.
 * Also grabs the internal options if available
 */
export function readTheme(css: string): ThemetteTheme {
  /**
   * matches set, shade, and value:
   * - `(?<!(?:-contrast))` ignores contrast variables
   * - `(?<!(?:-\d+-\d+))` ignores generated pairing variables
   */
  const colorRegex = /^--color-(.+?)(?<!(?:-contrast))-(\d+)(?<!(?:-\d+-\d+)):\s*([^;]+);/;
  const contrastRegex = /^--color-(.+?)-contrast-(\d+):\s*([^;]+);/;

  const lines = css
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("--color-"));

  const colors = lines
    .map((line) => line.match(colorRegex))
    .filter((matches) => matches !== null)
    .filter((matches) => matches.length === 4 && colorShades.includes(matches[2] as any))
    .map(([, set, shade, value]) => ({ set, shade, value }));

  const contrasts = lines
    .map((line) => line.match(contrastRegex))
    .filter((matches) => matches !== null)
    .filter((matches) => matches.length === 4 && colorShades.includes(matches[2] as any))
    .map(([, set, shade, value]) => ({ set, shade, value }));

  const sets = [...new Set([...colors.map(({ set }) => set), ...contrasts.map(({ set }) => set)])];

  const theme = sets.map((set) => {
    // create an object for the set
    const colorSet: ColorSet = {} as ColorSet;
    colorSet.contrasts = {} as ColorShadeObject;
    colorSet.name = set;
    colorSet.id = nanoid();

    // place the colors in
    colors
      .filter((color) => color.set === set)
      .forEach((color) => {
        colorSet[color.shade as ColorShade] = color.value;
      });

    // place the contrasts in
    contrasts
      .filter((contrast) => contrast.set === set)
      .forEach((contrast) => {
        colorSet.contrasts[contrast.shade as ColorShade] = contrast.value;
      });

    return colorSet;
  });

  if (!theme.every((set) => isColorSet(set))) throw Error("Bad Read!");
  return theme;
}

/**
 * Only checks if the given set fits the `ColorSet` type, it does not check
 * if the values within is actually valid CSS.
 */
function isColorSet(set: any): set is ColorSet {
  if (typeof set.name !== "string" || typeof set.contrasts !== "object") return false;
  return isColorShadeObject(set.contrasts) && isColorShadeObject(set);
}

/**
 * Only checks if the given set fits the `ColorShadeObject` type, it does not check
 * if the values within is actually valid CSS.
 */
function isColorShadeObject(set: any): set is ColorShadeObject {
  return colorShades.every((shade) => typeof set[shade] === "string");
}
