<script lang="ts">
  import ColorSetsGroup from "./ColorSetsGroup.svelte";

  let value = $state('primary');
</script>

<ColorSetsGroup bind:value />
