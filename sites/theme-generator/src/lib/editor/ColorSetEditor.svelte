<script lang="ts">
  import { ui } from "$lib/app/state.svelte";
    import ColorSetEditorName from "./ColorSetEditorName.svelte";
</script>

<div class="space-y-6 relative">
  <div class="space-y-2">
    <div class="text-xl capitalize font-bold">{ui.selectedSet.name}</div>
    <p class="text-sm text-background-700-300 font-light">Edit the current color here.</p>
  </div>

  <div>
    <ColorSetEditorName />
  </div>
</div>
