<script lang="ts">
  import { app, ui } from "$lib/app/state.svelte";
</script>

<div class="space-y-6">
  <div class="space-y-2">
    <div class="text-xl capitalize font-bold">{ui.currentSet.name}</div>
    <p class="text-sm text-background-700-300 font-light">Edit the current color here.</p>
  </div>

  <div>
    <label class="mb-2 block">
      <span class="label-text">name</span>
      <input
        class="border-none w-full ring-1 ring-background-200-800 focus:ring-foreground-500 rounded-lg bg-transparent"
        value={ui.currentSet.name}
        onchange={(e) => app.updateColorSet(ui.currentId, { name: e.currentTarget.value })}
      />
    </label>
  </div>
</div>
