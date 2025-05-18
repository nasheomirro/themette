<script lang="ts">
  import { app } from "$lib/app/app.svelte";
  import ColorSetEditorName from "./ColorSetEditorName.svelte";
  import ColorSetEditorPalette from "./ColorSetEditorPalette.svelte";

  import TrashIcon from "~icons/lucide/trash";

  const selectedSet = $derived(app.ids.selectedId ? app.sets[app.getIndexFromId(app.ids.selectedId)] : null);
</script>

{#if selectedSet}
  <div>
    <div class="relative mb-8">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-xl font-bold">Edit Color Set</h3>
        <button class="btn">
          <TrashIcon />
        </button>
      </div>
      <p class="text-sm font-light text-th-background-700-300">Edit the current chosen color set here.</p>
    </div>
    <div class="space-y-8">
      <ColorSetEditorName set={selectedSet} />
      <ColorSetEditorPalette set={selectedSet} />
    </div>
  </div>
{/if}
