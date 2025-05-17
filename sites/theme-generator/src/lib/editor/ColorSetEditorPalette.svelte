<script lang="ts">
  import chroma from "chroma-js";
  import type { ColorSet } from "$lib/app/types";

  type Props = {
    set: ColorSet;
  };

  const { set }: Props = $props();
</script>

<div>
  <div class="space-y-5">
    {#each [50, 500, 950] as const as shade}
      <div class="flex gap-4 items-center">
        <span class="text-xs w-6 text-center">
          {shade}
        </span>
        <button
          style="--bg: {set[shade]}; --c: {set.contrasts[shade]}"
          class="text-sm bg-(--bg) text-(--c) p-1.5 rounded font-mono shadow"
        >
          {chroma(set[shade])}
        </button>
      </div>
    {/each}
  </div>
</div>
