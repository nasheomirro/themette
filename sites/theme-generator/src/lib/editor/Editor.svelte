<script lang="ts">
  import { app } from "$lib/app/state.svelte";
  import ColorSetsGroup from "./ColorSetPicker.svelte";

  let value = $state(app.theme[0].name);
</script>

<ColorSetsGroup bind:value />
