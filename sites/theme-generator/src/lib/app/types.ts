export type ColorShade = "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950";
export type ColorShadeObject = { [K in ColorShade]: string };
export type ColorSet = { id: string; name: string; contrasts: ColorShadeObject } & ColorShadeObject;
export type ThemetteTheme = ColorSet[];

/** useful for hinting theme generator which color sets should be used as foreground and/or background */
export type InternalOptions = {
  foreground: string;
  background: string;
};

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends Function
    ? T
    : T extends object
      ? DeepReadonlyObject<T>
      : T;
