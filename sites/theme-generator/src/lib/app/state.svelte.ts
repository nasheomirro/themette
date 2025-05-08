import css from "$themes/themette.css?raw";
import type { ThemetteTheme } from "./types";
import { readTheme } from "./io/reader";
import { writeTheme } from "./io/writer";

class AppState {
  /** controls which panel is shown on mobile (`max-md:*`) */
  mobilePanel = $state<"preview" | "editor" | "code">("editor");
  
  /** controls which panel is shown on desktop (`md:*`) */
  desktopPanel = $state<"preview" | "code">("preview");

  theme = $state<ThemetteTheme>(readTheme(css));
  generated = $derived(writeTheme(this.theme));
}

export const app = new AppState();