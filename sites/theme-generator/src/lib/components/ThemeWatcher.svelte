<script lang="ts">
  import { app } from "$lib/app/state.svelte";

  $effect(() => {
    document.documentElement.setAttribute("style", app.generated.raw);
  });
</script>
 