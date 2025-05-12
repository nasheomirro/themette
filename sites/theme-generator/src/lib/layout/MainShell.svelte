<script lang="ts">
  import type { Snippet } from "svelte";
  import { RadioGroup } from "bits-ui";
  import { ui } from "$lib/app/state.svelte";

  import Navbar from "./Navbar.svelte";
  import BottomBar from "./BottomBar.svelte";

  import CodeIcon from "~icons/lucide/braces";
  import PreviewIcon from "~icons/lucide/eye";

  type Props = {
    editor: Snippet;
    preview: Snippet;
    code: Snippet;
  };

  const { code, editor, preview }: Props = $props();
</script>

<Navbar />

<div
  class="centered-container grid items-start md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr] pt-14 overflow-x-clip"
>
  <div
    class="
      {ui.panel.mobile === 'editor' ? 'max-md:block' : 'max-md:hidden'}
      max-md:col-start-1 max-md:row-start-1
      py-10 md:px-4 md:min-h-[calc(100vh-3.5rem)] md:sticky top-14 md:z-30
    "
  >
    {@render editor()}
  </div>
  <div
    class="
      {ui.panel.mobile === 'editor' && 'max-md:hidden'}
      relative z-0 max-md:col-start-1 max-md:row-start-1 min-h-[200vh] w-full
    "
  >
    <RadioGroup.Root
      orientation="horizontal"
      bind:value={ui.panel.desktop}
      class="max-md:hidden sticky top-16 ml-auto w-fit bg-background-50-950 border border-background-100-900 rounded-lg p-1 flex gap-0.5 items-center"
    >
      <RadioGroup.Item
        class="p-1.5 text-xs rounded data-[state=checked]:bg-background-100-900 hover:bg-background-100-900 transition"
        value="preview"
      >
        <PreviewIcon />
      </RadioGroup.Item>
      <RadioGroup.Item
        class="p-1.5 text-xs rounded data-[state=checked]:bg-background-100-900 hover:bg-background-100-900 transition"
        value="code"
      >
        <CodeIcon />
      </RadioGroup.Item>
    </RadioGroup.Root>

    <div
      class="
        {ui.panel.mobile === 'preview' ? 'max-md:block' : 'max-md:hidden'} 
        {ui.panel.desktop === 'preview' ? 'md:block' : 'md:hidden'}
      "
    >
      {@render preview()}
    </div>

    <div
      class="
      {ui.panel.mobile === 'generated' ? 'max-md:block' : 'max-md:hidden'}
      {ui.panel.desktop === 'generated' ? 'md:block' : 'md:hidden'}
    "
    >
      {@render code()}
    </div>
  </div>
</div>

<BottomBar />
