<script lang="ts">
  import { app } from "$lib/app/app.svelte";
  import type { ColorSet } from "$lib/app/types";

  type Props = {
    set: ColorSet;
  };

  const { set }: Props = $props();
</script>

<label class="mb-2 block">
  <span class="label-text">name</span>
  <input
    class="border-none w-full ring-1 ring-background-200-800 focus:ring-foreground-500 rounded-lg bg-transparent"
    value={set.name}
    onchange={(e) => app.updateColorSet(set.id, { name: e.currentTarget.value })}
  />
</label>
