import css from "$themes/themette.css?raw";
import type { ThemetteTheme } from "./types";
import { readTheme } from "./io/reader";
import { writeTheme } from "./io/writer";

class AppState {
  theme = $state<ThemetteTheme>(readTheme(css));
  generated = $derived(writeTheme(this.theme));
}

export const app = new AppState();