<script lang="ts">
  import chroma, { type Color } from "chroma-js";

  import { app } from "$lib/app/app.svelte";
  import { colorShades } from "$lib/app/constants";
  import type { ColorSet, ColorShade } from "$lib/app/types";
  import {
    compareContrastsForColor,
    createContrastSet,
    createShadeSetFromScale,
    genRandomColor,
    genScale,
    genScaleFromColor,
  } from "$lib/app/utils";

  import Select from "$lib/components/Select.svelte";

  import RandomIcon from "~icons/lucide/dices";
  import RefreshIcon from "~icons/lucide/refresh-ccw";

  const OPTIONS = [
    { value: "manual", label: "Manual" },
    { value: "linear", label: "Linear" },
    { value: "multicolor", label: "Multicolor" },
    { value: "seed", label: "Seed" },
  ];

  type Props = {
    set: ColorSet;
  };

  const { set }: Props = $props();

  let editMode = $state<"manual" | "linear" | "multicolor" | "seed">("seed");

  const shades = $derived<ColorShade[]>(
    editMode === "manual"
      ? colorShades
      : editMode === "linear"
        ? ["50", "950"]
        : editMode === "multicolor"
          ? ["50", "500", "950"]
          : editMode === "seed"
            ? ["500"]
            : colorShades,
  );

  const handleSeedGeneration = (seed: string | Color) => {
    const shades = createShadeSetFromScale(genScaleFromColor(seed));
    const contrasts = createContrastSet(shades, shades[50], shades[950]);

    app.updateColorSet(set.id, { ...shades, contrasts });
  };

  const handleLinearGeneration = () => {
    const shades = createShadeSetFromScale(genScale([set[50], set[950]]));
    const contrasts = createContrastSet(shades, shades[50], shades[950]);

    app.updateColorSet(set.id, { ...shades, contrasts });
  };

  const handleMultiColorGeneration = () => {
    const shades = createShadeSetFromScale(genScale([set[50], set[500], set[950]]));
    const contrasts = createContrastSet(shades, shades[50], shades[950]);

    app.updateColorSet(set.id, { ...shades, contrasts });
  };

  const refreshGeneratedValues = () => {
    if (editMode === "linear") handleLinearGeneration();
    if (editMode === "multicolor") handleMultiColorGeneration();
    if (editMode === "seed") handleSeedGeneration(set[500]);
  };

  const handleColorChange = (value: string, shade: ColorShade) => {
    if (chroma.valid(value)) {
      app.updateColorSet(set.id, {
        [shade]: value,
        contrasts: { [shade]: compareContrastsForColor(value, set.contrasts.light, set.contrasts.dark) },
      });

      // note that we aren't checking whether the appropriate shades have been updated.
      // Here we blindly trust that the UI is showing the appropriate shade inputs depending on the edit mode
      refreshGeneratedValues();
      return true;
    }

    return false;
  };
</script>

<div>
  <div class="mb-8">
    <div class="flex gap-2 items-center justify-between mb-4">
      <div class="flex gap-1">
        <button class="btn" onclick={() => handleSeedGeneration(genRandomColor())}>
          <RandomIcon />
        </button>
        <button class="btn" onclick={() => refreshGeneratedValues()}>
          <RefreshIcon />
        </button>
      </div>
      <div class="w-30">
        <Select type="single" items={OPTIONS} placeholder="" triggerLabel="Set Editing Mode" bind:value={editMode} />
      </div>
    </div>
    <div>
      <h3 class="text-sm mb-2">{OPTIONS.find((item) => item.value === editMode)?.label} Mode</h3>
      <p class="text-xs text-th-background-700-300 font-light">
        {#if editMode === "manual"}
          You can edit each shade manually, switch to other editing modes if you want to automatically interpolate
          between two colors, three colors, or generate the whole pallete with just one color.
        {:else if editMode === "linear"}
          shades between the lightest (50) and the darkest (950) are automatically generated. Switch to manual if you
          want to set them yourself.
        {:else if editMode === "multicolor"}
          shades between the lightest (50), the middle (500), and the darkest (950) are automatically generated. Switch
          to manual if you want to set them yourself.
        {:else if editMode === "seed"}
          All shades are automatically generated based on the middle (500). Switch to manual if you want to set them
          yourself.
        {/if}
      </p>
    </div>
  </div>

  <div class="mb-8">
    <div class="space-y-5">
      {#each shades as shade}
        <div class="flex gap-4 items-center">
          <span class="text-xs w-6 text-center">
            {shade}
          </span>
          <label class="w-7 h-7">
            <span class="sr-only">color shade - {shade} (native)</span>
            <input
              type="color"
              class="w-7 h-7 rounded shadow"
              value={chroma(set[shade]).hex()}
              oninput={({ currentTarget }) => handleColorChange(currentTarget.value, shade)}
            />
          </label>
          <label class="grow">
            <span class="sr-only">color shade ({shade})</span>
            <input
              class="input"
              value={chroma(set[shade]).hex()}
              onchange={({ currentTarget }) => {
                const isSuccess = handleColorChange(currentTarget.value, shade);
                // value might not get updated because it's invalid, force the input to change back to the original value
                if (!isSuccess) currentTarget.value = set[shade];
              }}
            />
          </label>
        </div>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-11 min-h-8 rounded-lg overflow-hidden">
    {#each colorShades as shade}
      <div style="--bg: var(--color-{set.name}-{shade})" class="bg-(--bg)"></div>
    {/each}
  </div>
</div>

<style>
  /* input reset */
  input[type="color"]::-moz-color-swatch {
    border: none;
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 0;
  }

  input[type="color"]::-webkit-color-swatch {
    border: none;
  }
</style>
