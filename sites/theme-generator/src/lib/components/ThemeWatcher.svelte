<script lang="ts">
  import { writeTheme } from "$lib/app/io/writer";
  import { app } from "$lib/app/app.svelte";

  const { raw } = $derived(writeTheme(app.sets));
  $effect(() => document.documentElement.setAttribute("style", raw));
</script>
