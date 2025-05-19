import { nanoid } from "nanoid";
import { colorShades } from "../constants";
import type { ColorSet, ShadeSet, ColorShade, ThemetteTheme, ContrastSet } from "../types";

/**
 * Converts a css string to a `ThemetteTheme` if possible, throws an error if it fails.
 * Also grabs the internal options if available
 */
export function readTheme(css: string): ThemetteTheme {
  /**
   * matches colors, capturing `set`, `shade`, and `value`.
   * - `(?<!(?:-contrast))` ignores contrast variables
   * - `(?<!(?:50-950...))` ignores generated pairing variables
   */
  const colorRegex =
    /^--color-(.+?)(?<!(?:-contrast))-(\d+)(?<!(?:50-950|100-900|200-800|300-700|400-600|500-500|600-400|700-300|800-200|900-100|950-50)):\s*([^;]+);/;

  /**
   * matches the light-dark contrasts, capturing `set`, `mode`, and `value`.
   */
  const contrastLightDarkRegex = /^--color-(.+?)-contrast-(light|dark):\s*([^;]+);/;
  /**
   * matches color-shade contrasts, capturing `set`, `shade`, and `value`.
   * - `(var\(--color-\1-contrast-(?:light|dark)\))` is to make sure the value uses light-dark contrast variables.
   */
  const contrastRegex = /^--color-(.+?)-contrast-(\d+):\s*(var\(--color-\1-contrast-(?:light|dark)\));/;

  const lines = css
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("--color-"));

  const colors = lines
    .map((line) => line.match(colorRegex))
    .filter((matches) => matches !== null)
    .filter((matches) => matches.length === 4 && colorShades.includes(matches[2] as any))
    .map(([, set, shade, value]) => ({ set, shade, value }));

  const contrastLightDark = lines
    .map((line) => line.match(contrastLightDarkRegex))
    .filter((matches) => matches !== null)
    .filter((matches) => matches.length === 4)
    .map(([, set, mode, value]) => ({ set, mode, value }));

  const contrasts = lines
    .map((line) => line.match(contrastRegex))
    .filter((matches) => matches !== null)
    .filter((matches) => matches.length === 4 && colorShades.includes(matches[2] as any))
    .map(([, set, shade, value]) => ({ set, shade, value }));

  const sets = [...new Set([...colors.map(({ set }) => set), ...contrasts.map(({ set }) => set)])];

  const theme = sets.map((set) => {
    // create an object for the set
    const colorSet: ColorSet = {} as ColorSet;
    colorSet.contrasts = {} as ContrastSet;
    colorSet.name = set;
    colorSet.id = nanoid();

    // place the colors in
    colors
      .filter((color) => color.set === set)
      .forEach((color) => {
        colorSet[color.shade as ColorShade] = color.value;
      });

    // place the contrasts used in
    contrastLightDark
      .filter((contrast) => contrast.set === set)
      .forEach((contrast) => {
        colorSet.contrasts[contrast.mode as "light" | "dark"] = contrast.value;
      });

    // place the contrasts shades in
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
  return isContrastSet(set.contrasts) && isShadeSet(set);
}

/**
 * Only checks if the given set fits the `ContrastSet` type, it does not check
 * if the values within is actually valid CSS.
 */
function isContrastSet(set: any): set is ContrastSet {
  return Object.hasOwn(set, "light") && Object.hasOwn(set, "dark") && isShadeSet(set);
}

/**
 * Only checks if the given set fits the `ShadeSet` type, it does not check
 * if the values within is actually valid CSS.
 */
function isShadeSet(set: any): set is ShadeSet {
  return colorShades.every((shade) => typeof set[shade] === "string");
}
