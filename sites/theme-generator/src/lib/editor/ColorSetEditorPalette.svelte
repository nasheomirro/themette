<script lang="ts">
  import chroma from "chroma-js";
  import type { ColorSet } from "$lib/app/types";
  import { app } from "$lib/app/app.svelte";
  import { colorShades } from "$lib/app/constants";

  type Props = {
    set: ColorSet;
  };

  const { set }: Props = $props();
</script>

<div>
  <div class="space-y-5">
    {#each colorShades as shade}
      <div class="flex gap-4 items-center">
        <span class="text-xs w-6 text-center">
          {shade}
        </span>
        <label class="w-7 h-7">
          <span class="sr-only">Use native color picker to edit shade {shade}</span>
          <input
            type="color"
            class="w-7 h-7 rounded shadow"
            bind:value={() => chroma(set[shade]).hex(), (v) => app.updateColorSet(set.id, { [shade]: v })}
          />
        </label>
        <label class="grow">
          <span class="sr-only">color shade ({shade})</span>
          <input class="input" bind:value={() => chroma(set[shade]).hex(), (v) => app.updateColorSet(set.id, { [shade]: v })} />
        </label>
      </div>
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
