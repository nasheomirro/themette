<script lang="ts">
  import "$styles/main.css";
  import LightDarkWatcher from "$lib/components/LightDarkWatcher.svelte";
  import ThemeWatcher from "$lib/components/ThemeWatcher.svelte";

  let { children } = $props();
</script>

<LightDarkWatcher />
<ThemeWatcher />
{@render children()}
