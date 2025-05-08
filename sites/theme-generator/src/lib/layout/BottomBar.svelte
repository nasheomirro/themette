<script lang="ts">
  import type { Component } from "svelte";
  import { RadioGroup } from "bits-ui";
  import { app } from "$lib/app/state.svelte";

  import EditorIcon from "~icons/lucide/palette";
  import PreviewIcon from "~icons/lucide/eye";
  import CodeIcon from "~icons/lucide/braces";

  const icons: { [K in typeof app.mobilePanel]: Component } = {
    code: CodeIcon,
    editor: EditorIcon,
    preview: PreviewIcon,
  };
</script>

{#snippet item(name: string, value: typeof app.mobilePanel)}
  <RadioGroup.Item
    class="grow text-sm font-light flex items-center justify-center flex-col gap-0.5 data-[state=checked]:text-foreground-800-200 transition"
    {value}
  >
    {@const Icon = icons[value]}
    <Icon />
    <span class="text-xs">{name}</span>
  </RadioGroup.Item>
{/snippet}

<RadioGroup.Root
  bind:value={app.mobilePanel}
  class="fixed md:hidden bg-background-50-950 flex items-center left-0 bottom-0 z-40 w-full min-h-[4rem] border-t border-t-background-100-900"
>
  {#snippet child({ props })}
    <nav {...props}>
      {@render item("Colors", "editor")}
      {@render item("Preview", "preview")}
      {@render item("Code", "code")}
    </nav>
  {/snippet}
</RadioGroup.Root>
