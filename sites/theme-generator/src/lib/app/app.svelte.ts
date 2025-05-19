import themettecss from "$styles/themes/themette.css?raw";
import { nanoid } from "nanoid";
import { readTheme } from "./io/reader";
import type { ColorSet, ContrastSet, ThemetteTheme, UISetIds } from "./types";
import {
  createContrastSet,
  createShadeSetFromScale,
  genRandomColor,
  genScaleFromColor,
  getNextNameSuffix,
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
   * updates the specified object with the given partial updates, you cannot update the id or the name through this method.
   * @param id the id of the set
   * @param updates the new values for the set, **careful, this gets mutated**
   */
  updateColorSet(
    id: string,
    updates: Partial<Omit<ColorSet, "id" | "contrasts"> & { contrasts: Partial<ContrastSet> }>,
  ) {
    const index = this.#sets.findIndex((set) => set.id === id);
    const set: ColorSet | undefined = this.#sets[index];
    if (set) {
      // handle updating the set's name
      if (Object.hasOwn(updates, "name")) {
        let name = updates.name || set.name;
        name = name
          .trim()
          .toLowerCase()
          .replaceAll(/[^a-z0-9\s\-]/g, "")
          .trim() // edge case for when an invalid character leaves space at the ends
          .replaceAll(/\s+/g, "-");

        updates.name = getNextNameSuffix(
          this.#sets.filter((set) => set.id !== id).map((set) => set.name),
          name,
        );
      }

      const { contrasts, ..._updates } = updates;

      this.#sets[index] = { ...set, ..._updates };
      this.#sets[index].contrasts = { ...set.contrasts, ...contrasts };
    }
  }

  createEmptyColorSet() {
    const name = getNextNameSuffix(
      this.#sets.map((set) => set.name),
      "untitled",
    );
    const seed = genRandomColor();
    const shades = createShadeSetFromScale(genScaleFromColor(seed));
    const contrasts = createContrastSet(shades, shades[50], shades[950]);

    const colorSet: ColorSet = {
      name,
      id: nanoid(),
      ...shades,
      contrasts,
    };

    this.#sets.push(colorSet);
    return colorSet;
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
