<script lang="ts">
  import { app } from "$lib/app/state.svelte";

  import HandleBarIcon from "~icons/lucide/align-justify";

  type Props = {
    value: string;
  };

  let { value = $bindable() }: Props = $props();
</script>

<div class="p-4 space-y-6">
  <div class="space-y-2">
    <div class="text-2xl font-bold">Color Sets</div>
    <p class="text-sm text-background-700-300">All the colors of your theme is placed here.</p>
  </div>
  <ul class="space-y-2">
    {#each Object.keys(app.theme) as key (key)}
      <li style="--self: {app.theme[key][500]}" class="relative z-0">
        <button
          onclick={() => (value = key)}
          class="flex w-full items-center gap-5 p-3 rounded-lg hover:bg-background-100-900/50 transition {value === key && '!bg-background-100-900'}"
        >
          <span class="bg-(--self) rounded-lg w-7 h-7"></span>
          <span>{key}</span>
        </button>
        <button class="right-4 top-1/2 -translate-y-1/2 absolute text-background-700-300/50">
          <HandleBarIcon />
        </button>
      </li>
    {/each}
  </ul>
</div>
