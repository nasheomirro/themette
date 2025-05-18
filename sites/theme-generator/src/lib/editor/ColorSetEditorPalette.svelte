<script lang="ts">
  import chroma from "chroma-js";

  import type { ColorSet, ColorShade } from "$lib/app/types";
  import { app } from "$lib/app/app.svelte";
  import { colorShades } from "$lib/app/constants";
  import Select from "$lib/components/Select.svelte";

  import RandomIcon from "~icons/lucide/dices";
  import RefreshIcon from "~icons/lucide/refresh-ccw";

  type Props = {
    set: ColorSet;
  };

  const { set }: Props = $props();

  let editMode: "manual" | "linear" | "multicolor" | "seed" = $state("multicolor");

  const options = [
    { value: "manual", label: "Manual" },
    { value: "linear", label: "Linear" },
    { value: "multicolor", label: "Multicolor" },
    { value: "seed", label: "Seed" },
  ];

  const shades = $derived.by<ColorShade[]>(() => {
    if (editMode === "manual") {
      return colorShades;
    } else if (editMode === "multicolor") {
      return ["50", "500", "950"];
    } else if (editMode === "linear") {
      return ["50", "950"];
    } else if (editMode === "seed") {
      return ["500"];
    }

    return colorShades;
  });
</script>

<div>
  <div class="mb-8">
    <div class="flex gap-2 items-center justify-between mb-4">
      <div class="flex gap-1">
        <button class="btn">
          <RandomIcon />
        </button>
        <button class="btn">
          <RefreshIcon />
        </button>
      </div>
      <div class="w-30">
        <Select type="single" items={options} placeholder="" triggerLabel="Set Editing Mode" bind:value={editMode} />
      </div>
    </div>
    <div>
      <h3 class="text-sm mb-2">{options.find((item) => item.value === editMode)?.label}</h3>
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

  <div>
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
              bind:value={() => chroma(set[shade]).hex(), (v) => app.updateColorSet(set.id, { [shade]: v })}
            />
          </label>
          <label class="grow">
            <span class="sr-only">color shade ({shade})</span>
            <input
              class="input"
              bind:value={() => chroma(set[shade]).hex(), (v) => app.updateColorSet(set.id, { [shade]: v })}
            />
          </label>
        </div>
      {/each}
    </div>
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
