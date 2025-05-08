<script lang="ts">
  import { app } from "$lib/app/state.svelte";
  import ThemeWatcher from "$lib/components/ThemeWatcher.svelte";
  import "../app.css";

  let { children } = $props();
</script>

<ThemeWatcher />
{@render children()}
