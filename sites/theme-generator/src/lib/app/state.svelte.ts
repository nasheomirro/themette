import css from "$themes/themette.css?raw";
import type { ThemetteTheme } from "./types";
import { readTheme } from "./io/reader";

class PanelState {
  mobile = $state<"preview" | "editor" | "generated">("editor");
  desktop = $state<"preview" | "generated">("generated");
}

class AppState {
  #theme = $state<ThemetteTheme>(readTheme(css));
  currentSet = $state<string>(this.#theme[0].name);
  currentIndex = $derived(this.#theme.findIndex((set) => set.name === this.currentSet) || 0);

  get theme() {
    return this.#theme;
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
