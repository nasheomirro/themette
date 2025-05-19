/** Fixed shades for all colors, currently it is not possible to define your own shades */
export type ColorShade = "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950";

export type ShadeSet = { [K in ColorShade]: string };

export type ContrastSet = ShadeSet & {
  light: string;
  dark: string;
};

/** An object representing an idividual color set in a themette theme */
export type ColorSet = { id: string; name: string; contrasts: ContrastSet } & ShadeSet;

/** The main data object of the application */
export type ThemetteTheme = ColorSet[];

/** an object that holds the ids of the color sets used by the UI */
export type UISetIds = {
  /** The currently selected set's id. */
  selectedId: string | null;
  /** the id of the set that would be used for overriding the `--color-th-foreground-*` colors */
  foregroundId: string | null;
  /** the id of the set that would be used for overriding the `--color-th-background-*` colors */
  backgroundId: string | null;
};
