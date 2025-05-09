<script lang="ts">
  import "../app.css";
  import LightDarkWatcher from "$lib/components/LightDarkWatcher.svelte";
  import ThemeWatcher from "$lib/components/ThemeWatcher.svelte";
  import { app } from "$lib/app/state.svelte";

  let { children } = $props();
</script>

<LightDarkWatcher />
<ThemeWatcher />
{@render children()}
