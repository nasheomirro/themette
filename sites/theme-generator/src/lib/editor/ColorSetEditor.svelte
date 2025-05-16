<script lang="ts">
  import { app } from "$lib/app/app.svelte";
  import ColorSetEditorName from "./ColorSetEditorName.svelte";

  const selectedSet = $derived(app.ids.selectedId ? app.sets[app.getIndexFromId(app.ids.selectedId)] : null);
</script>

{#if selectedSet}
  <div class="space-y-6">
    <div>
      <ColorSetEditorName set={selectedSet} />
    </div>
  </div>
{/if}
