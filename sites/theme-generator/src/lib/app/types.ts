export type ColorShade = "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950";

export type ColorShadeObject = { [K in ColorShade]: string };
export type ColorSet = { name: string, contrasts: ColorShadeObject } & ColorShadeObject;
export type ThemetteTheme = ColorSet[];
