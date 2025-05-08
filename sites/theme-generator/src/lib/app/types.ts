export type ColorShade = "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950";

export type ColorSet = { [K in ColorShade]: string };
export type ColorFullSet = ColorSet & { contrasts: ColorSet };
export type ThemetteTheme = { [k: string]: ColorFullSet };
