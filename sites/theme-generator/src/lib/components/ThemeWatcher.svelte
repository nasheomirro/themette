<script lang="ts">
  import { writeTheme } from "$lib/app/io/writer";
  import { app } from "$lib/app/state.svelte";

  const internalVariables = $derived(writeTheme(app.theme));
  $effect(() => document.documentElement.setAttribute("style", internalVariables));
</script>
