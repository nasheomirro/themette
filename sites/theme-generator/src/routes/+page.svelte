<script>
  import Editor from "$lib/editor/Editor.svelte";
  import MainShell from "$lib/shell/MainShell.svelte";
</script>

<MainShell>
  {#snippet editor()}
    <Editor />
  {/snippet}
  {#snippet code()}
    <div></div>
  {/snippet}
  {#snippet preview()}
    <div></div>
  {/snippet}
</MainShell>
