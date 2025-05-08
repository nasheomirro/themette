<script lang="ts">
  import { RadioGroup } from "bits-ui";
  import { app } from "$lib/app/state.svelte";

  import Logo from "~icons/lucide/box";
  import PreviewIcon from "~icons/lucide/airplay";
  import CodeIcon from "~icons/lucide/square-terminal";

  $inspect(app.panel);
</script>

<nav class="py-2.5">
  <ul class="middle flex items-center justify-between">
    <li><Logo /></li>
    <RadioGroup.Root bind:value={app.panel} class="flex items-center gap-1">
      {#snippet child({ props })}
        <ul {...props}>
          <li>
            <RadioGroup.Item
              class="p-1.5 rounded transition hocus:bg-background-100-900/50 data-[state=checked]:!bg-background-100-900/75"
              value="preview"
            >
              <PreviewIcon />
            </RadioGroup.Item>
          </li>
          <li>
            <RadioGroup.Item
              class="p-1.5 rounded transition hocus:bg-background-100-900/50 data-[state=checked]:!bg-background-100-900/75"
              value="code"
            >
              <CodeIcon />
            </RadioGroup.Item>
          </li>
        </ul>
      {/snippet}
    </RadioGroup.Root>
  </ul>
</nav>
