<script lang="ts">
  import { app } from "$lib/app/app.svelte";
  import type { ColorSet } from "$lib/app/types";

  type Props = {
    set: ColorSet;
  };

  const { set }: Props = $props();
</script>

<div>
  <label class="mb-2 block">
    <span class="label-text">name</span>
    <input
      class="border-none w-full ring-1 ring-th-background-200-800 focus:ring-th-foreground-500 rounded-lg bg-transparent"
      value={set.name}
      onchange={(e) => {
        const _set = app.updateColorSet(set.id, { name: e.currentTarget.value });
        // edge-case for when user types the exact same name except that it's invalid.
        // value won't trigger because it assumes no change has been made, so we'll have to correct it here manually.
        e.currentTarget.value = _set ? _set.name : set.name;
      }}
    />
  </label>
  <p class="text-sm text-th-background-700-300 font-light">
    must be unique and can only contain letter characters, numbers, or "-"
  </p>
</div>
