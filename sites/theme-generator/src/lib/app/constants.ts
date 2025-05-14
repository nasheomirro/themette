import type { ColorShade } from "./types";

/** an array that holds all valid color shades */
export const colorShades = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const satisfies ColorShade[];

/** an array that holds all valid color pairings */
export const colorPairings = [
  ["50", "950"],
  ["100", "900"],
  ["200", "800"],
  ["300", "700"],
  ["400", "600"],
  ["600", "400"],
  ["700", "300"],
  ["800", "200"],
  ["900", "100"],
  ["950", "50"],
] as const;
