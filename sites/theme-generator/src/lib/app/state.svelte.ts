import css from "$themes/themette.css?raw";
import type { ColorSet, DeepReadonly, ThemetteTheme } from "./types";
import { readTheme } from "./io/reader";

class AppState {
  #theme = $state<ThemetteTheme>(readTheme(css));

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

  currentId = $state<string>("");
  currentIndex = $derived.by(() => {
    const i = this.#app.theme.findIndex((set) => set.id === this.currentId);
    return i !== -1 ? i : 0;
  });

  get currentSet() {
    return this.#app.theme[this.currentIndex];
  }

  constructor(app: AppState) {
    this.#app = app;
    this.currentId = app.theme[0].id;
  }
}

export const app = new AppState();
export const ui = new UIState(app);
