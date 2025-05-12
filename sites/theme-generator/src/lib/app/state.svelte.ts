import css from "$themes/themette.css?raw";
import type { ColorSet, DeepReadonly, InternalOptions, ThemetteTheme } from "./types";
import { readTheme } from "./io/reader";

const { theme: defaultTheme, options: _options } = readTheme(css);

const options: InternalOptions = {
  background: "surface",
  foreground: "primary",
  ..._options,
};

class AppState {
  #theme = $state<ThemetteTheme>(defaultTheme);

  get theme(): DeepReadonly<ThemetteTheme> {
    return this.#theme;
  }

  updateColorSet(id: string, updates: Partial<Omit<ColorSet, "id">>) {
    const index = this.#theme.findIndex((set) => set.id === id);
    if (index !== -1) {
      const set = this.#theme[index];
      this.#theme[index] = { ...set, ...updates };
    }
  }

  /**
   * moves value in `from` to `target`.
   * @param from the index of the color set to switch
   * @param target the index where the color set will go
   */
  reorderColorSet(from: number, target: number) {
    // Validate index and target
    if (from < 0 || from >= this.#theme.length || target < 0 || target >= this.#theme.length) {
      throw new Error("Index or target out of bounds");
    }

    const [item] = this.#theme.splice(from, 1); // Remove the item from its current position
    this.#theme.splice(target, 0, item); // Insert it at the target position
  }
}

type CurrentPanelObj = {
  mobile: "preview" | "editor" | "generated";
  desktop: "preview" | "generated";
};

class UIState {
  #app: AppState;

  /** determines the current active panel for both mobile and desktop */
  panel = $state<CurrentPanelObj>({
    mobile: "editor",
    desktop: "preview",
  });

  /** the id of the selected set, this only matters in the current UI layout */
  selectedSetId = $state<string>()!;
  /** the id of the color set to be used as `foreground` */
  foregroundSetId = $state<string>()!;
  /** the id of the color set to be used as `background` */
  backgroundSetId = $state<string>()!;

  selectedSet = $derived.by(() => {
    const index = this.#app.theme.findIndex((set) => set.id === this.selectedSetId);
    return this.#app.theme[index] || this.#app.theme[0];
  });

  constructor(app: AppState) {
    this.#app = app;

    this.selectedSetId = app.theme[0].id;

    this.foregroundSetId = (
      app.theme[app.theme.findIndex((set) => set.name === options.foreground)] || app.theme[0]
    )?.id;

    this.backgroundSetId = (
      app.theme[app.theme.findIndex((set) => set.name === options.background)] || app.theme[app.theme.length - 1]
    ).id;
  }
}

export const app = new AppState();
export const ui = new UIState(app);
