import themettecss from "$styles/themes/themette.css?raw";
import { nanoid } from "nanoid";
import { readTheme } from "./io/reader";
import type { ColorSet, ThemetteTheme, UISetIds } from "./types";
import {
  createContrastsForShadeSet,
  createShadeSetFromScale,
  genRandomColor,
  genScaleFromColor,
  type DeepReadonly,
} from "./utils";

// Note that the default is assumed to be themette.css and is hard coded in
const defaultTheme = readTheme(themettecss);
const defaultUISetIds: UISetIds = {
  selectedId: defaultTheme[defaultTheme.findIndex((set) => set.name === "primary")].id,
  foregroundId: defaultTheme[defaultTheme.findIndex((set) => set.name === "primary")].id,
  backgroundId: defaultTheme[defaultTheme.findIndex((set) => set.name === "surface")].id,
};

/** The main state manager for the application */
class AppState {
  #sets = $state<ThemetteTheme>(defaultTheme);
  #ids = $state<UISetIds>(defaultUISetIds);

  /** the readonly version for the internal `#sets` property */
  get sets(): DeepReadonly<ThemetteTheme> {
    return this.#sets;
  }

  /** the readonly version for the internal `#ids` property */
  get ids(): DeepReadonly<UISetIds> {
    return this.#ids;
  }

  /** finds the index of the given id, returns -1 if not found */
  getIndexFromId(id: string) {
    return this.#sets.findIndex((set) => set.id === id);
  }

  /**
   * Updates the specified set id to the given value. Does nothing if the given id does not exist.
   * @param key the set id you want to update
   * @param value the id of the set
   */
  updateUISetId(key: keyof UISetIds, value: string | null) {
    if (value === null) this.#ids[key] = value;
    else if (this.#sets.find((set) => set.id === value)) {
      this.#ids[key] = value;
    }
  }

  /**
   * updates the specified object with the given partial updates
   * @param id the id of the set
   * @param updates the new values for the set
   */
  updateColorSet(id: string, updates: Partial<Omit<ColorSet, "id">>) {
    const index = this.#sets.findIndex((set) => set.id === id);
    if (index !== -1) {
      const set = this.#sets[index];
      this.#sets[index] = { ...set, ...updates };
    }
  }

  createEmptyColorSet() {
    const seed = genRandomColor();
    const shades = createShadeSetFromScale(genScaleFromColor(seed));
    const contrasts = createContrastsForShadeSet(shades, shades[50], shades[950]);

    const count = this.#sets.reduce((greatest: null | number, set) => {
      if (set.name.startsWith("untitled")) {
        let suffix = set.name.match(/untitled-(\d+)/)?.[1];
        let increment = !suffix ? 1 : parseInt(suffix) + 1;
        return greatest === null ? increment : greatest < increment ? increment : greatest;
      }

      return greatest;
    }, null);

    const colorSet: ColorSet = {
      name: "untitled" + (count ? `-${count}` : ""),
      id: nanoid(),
      ...shades,
      contrasts,
    };

    this.#sets.push(colorSet);
  }

  deleteColorSet(id: string) {
    const index = this.getIndexFromId(id);
    if (index === -1) return;

    // filter out the color set
    this.#sets = this.#sets.filter((set) => set.id !== id);

    // for selected ids, try moving the selection one index down/up or set to null if empty
    if (this.#ids.selectedId === id) {
      let i = index < this.#sets.length ? index : index - 1; // note the set already got shifted
      let id = this.#sets[i] ? this.#sets[i].id : null;
      this.updateUISetId("selectedId", id);
    }
    // same for the foreground id
    if (this.#ids.foregroundId === id) {
      let i = index < this.#sets.length ? index : index - 1; // note the set already got shifted
      let id = this.#sets[i] ? this.#sets[i].id : null;
      this.updateUISetId("foregroundId", id);
    }
    // for the background id, we should just set it to null
    if (this.#ids.backgroundId === id) {
      this.updateUISetId("backgroundId", null);
    }
  }

  /**
   * moves value in `from` to `target`.
   * @param from the index of the color set to switch
   * @param target the index where the color set will go
   */
  reorderColorSet(from: number, target: number) {
    // Validate index and target
    if (from < 0 || from >= this.#sets.length || target < 0 || target >= this.#sets.length) {
      throw new Error("Index or target out of bounds");
    }

    const [item] = this.#sets.splice(from, 1); // Remove the item from its current position
    this.#sets.splice(target, 0, item); // Insert it at the target position
  }
}

export const app = new AppState();
