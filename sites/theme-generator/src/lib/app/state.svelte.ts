import css from "$themes/themette.css?raw";
import type { ColorSet, DeepReadonly, ThemetteTheme } from "./types";
import { readTheme } from "./io/reader";

class PanelState {
  mobile = $state<"preview" | "editor" | "generated">("editor");
  desktop = $state<"preview" | "generated">("generated");
}

class AppState {
  #theme = $state<ThemetteTheme>(readTheme(css));
  currentId = $state<string>(this.#theme[0].id);
  currentIndex = $derived.by(() => {
    const i = this.#theme.findIndex((set) => set.id === this.currentId);
    return i !== -1 ? i : 0;
  });

  get theme(): DeepReadonly<ThemetteTheme> {
    return this.#theme;
  }

  get currentSet(): DeepReadonly<ColorSet> {
    return this.#theme[this.currentIndex];
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

export const app = new AppState();
export const panel = new PanelState();
