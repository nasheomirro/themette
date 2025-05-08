<script>
  import MainShell from "$lib/layout/MainShell.svelte";
</script>

<MainShell>
  {#snippet editor()}
    <div>editor</div>
  {/snippet}
  {#snippet code()}
    <div>code</div>
  {/snippet}
  {#snippet preview()}
    <div>preview</div>
  {/snippet}
</MainShell>
