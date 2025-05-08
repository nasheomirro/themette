<script lang="ts">
  import { fly } from "svelte/transition";
  import { mode, toggleMode } from "mode-watcher";

  import ThemetteLogo from "~icons/lucide/box";
  import GithubLogo from "~icons/lucide/github";
  import SunIcon from "~icons/lucide/sun";
  import MoonIcon from "~icons/lucide/moon";
</script>

<nav class="py-2.5 md:py-4">
  <ul class="middle flex items-center gap-1">
    <li>
      <ThemetteLogo />
    </li>
    <li class="ml-auto">
      <a class="transition block p-2 rounded-lg hover:bg-background-100-900" href="https://github.com/nasheomirro">
        <GithubLogo />
      </a>
    </li>
    <li>
      <button class="transition grid p-2 rounded-lg hover:bg-background-100-900" onclick={toggleMode}>
        {#if mode.current === "dark"}
          <span class="col-start-1 row-start-1" in:fly={{ y: -10, delay: 100 }} out:fly={{ y: -10 }}>
            <MoonIcon />
          </span>
        {:else}
          <span class="col-start-1 row-start-1" in:fly={{ y: 10, delay: 100 }} out:fly={{ y: 10 }}>
            <SunIcon />
          </span>
        {/if}
      </button>
    </li>
  </ul>
</nav>
