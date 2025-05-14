<script lang="ts">
  import { app } from "$lib/app/app.svelte";
  import ColorSetEditorName from "./ColorSetEditorName.svelte";

  const selectedSet = $derived(app.ids.selectedId ? app.sets[app.getIndexFromId(app.ids.selectedId)] : null);
</script>

{#if selectedSet}
  <div class="space-y-6">
    <div class="space-y-2">
      <div class="text-xl capitalize font-bold">{selectedSet.name}</div>
      <p class="text-sm text-background-700-300 font-light">Edit the current color here.</p>
    </div>

    <div>
      <ColorSetEditorName set={selectedSet} />
    </div>
  </div>
{/if}
