<script>
  import { app, ui } from "$lib/app/state.svelte";
</script>

<label class="mb-2 block">
  <span class="label-text">name</span>
  <input
    class="border-none w-full ring-1 ring-background-200-800 focus:ring-foreground-500 rounded-lg bg-transparent"
    value={ui.selectedSet.name}
    onchange={(e) => app.updateColorSet(ui.selectedSetId, { name: e.currentTarget.value })}
  />
</label>
