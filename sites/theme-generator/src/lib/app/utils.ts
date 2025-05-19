import { colorShades } from "./constants";
import chroma, { type Color, type Scale } from "chroma-js";
import type { ColorShade, ContrastSet, ShadeSet } from "./types";

/**
 * returns a `ShadeSet` using the generated colors from the given scale.
 * @param scale the scale used to generate colors
 */
export function createShadeSetFromScale(scale: Scale) {
  const colors = scale.colors(colorShades.length);
  const obj: Partial<ShadeSet> = {};
  for (let i = 0; i < colorShades.length; i++) {
    obj[colorShades[i]] = colors[i];
  }

  return obj as ShadeSet;
}

/**
 * returns the color that has the best contrast for the given color as `"light" | "dark"`
 * @param color the color to contrast
 * @param light the light contrast color
 * @param dark the dark contrast color
 */
export function compareContrastsForColor(color: string | Color, a: string | Color, b: string | Color) {
  const v = chroma(color);
  const l = chroma(a);
  const d = chroma(b);

  return chroma.contrast(v, l) > chroma.contrast(v, d) ? "light" : "dark";
}

/**
 * returns a `ContrastSet` that contains the contrasts for the given `set` using the given `light` and `dark` values.
 * @param set the `ShadeSet` to map from
 * @param light the light contrast color
 * @param dark the dark contrast color
 */
export function createContrastSet(set: ShadeSet, light: string | Color, dark: string | Color) {
  const obj: Partial<ContrastSet> = {};

  obj.light = chroma(light).css("oklab");
  obj.dark = chroma(dark).css("oklab");

  for (let key of Object.keys(set) as ColorShade[]) {
    const best = compareContrastsForColor(set[key], light, dark);
    obj[key] = best;
  }

  return obj as ContrastSet;
}

/**
 * returns a complete array of color shades generated from the given values of `from`.
 * @param from an array of color values for interpolation
 */
export function genScale(from: [string, string] | [string, string, string]) {
  const colors = chroma.scale(from).mode("oklch");
  return from.length > 2 ? colors.correctLightness() : colors;
}

/**
 * returns a complete array of color shades generated from the given seed.
 * Note that the given color is used as the middle shade "500"
 * @param seed the `Color` to generate shades from.
 */
export function genScaleFromColor(seed: Color | string) {
  seed = chroma(seed);
  const lightness = seed.get("hsl.l");
  const lto = lightness < 5 ? 2 : 2.5;
  const dto = lightness > 5 ? 2 : 3;

  const l = seed.brighten(lto).hex();
  const m = seed.hex();
  const d = seed.darken(dto).hex();

  return genScale([l, m, d]).correctLightness();
}

/**
 *  given a list of strings and a name, will find the next unique name sequence if the given name
 *  has duplicates.
 *
 *  Note that the `name` has to not have a suffix already.
 */
export function getNextNameSuffix(arr: string[], name: string) {
  const regex = new RegExp("^" + name + "-?((?<=-)\\d+)?$");

  // we want to add "name" here in case name also has a suffix
  const n = arr.reduce((greatest: null | number, item) => {
    const matches = item.match(regex);
    let base = matches?.[0];
    let suffix = matches?.[1];

    // found a duplicate
    if (base) {
      let increment = !suffix ? 2 : parseInt(suffix) + 1;
      return greatest === null ? increment : greatest < increment ? increment : greatest;
    }

    return greatest;
  }, null);

  return n ? `${name}-${n}` : name;
}

/**
 * creates a random `Color`.
 * @param lightness the range to randomize the color's lightness, default is `[0.45, 0.6]`
 * @param saturation the range to randomize the color's saturation
 */
export function genRandomColor(lightness: [number, number] = [0.45, 0.6], saturation?: [number, number]) {
  const l = Math.random() * (lightness[1] - lightness[0]) + lightness[0]; // Random between the given range
  let chromaColor = chroma.random().set("hsl.l", l);

  if (saturation) {
    const s = Math.random() * (saturation[1] - saturation[0]) + saturation[0]; // Random between the given range
    chromaColor = chromaColor.set("hsl.s", s);
  }

  return chromaColor;
}

// https://stackoverflow.com/a/49670389
/** recursively casts `Readonly` on an object. */
export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends Function
    ? T
    : T extends object
      ? DeepReadonlyObject<T>
      : T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
