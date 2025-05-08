<script lang="ts">
  import { ModeWatcher, toggleMode } from "mode-watcher";
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.ctrlKey && e.key === "q") {
      e.preventDefault();
      toggleMode();
    }
  }}
/>
<ModeWatcher />
