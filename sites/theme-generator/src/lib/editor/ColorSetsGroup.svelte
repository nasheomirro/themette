<script lang="ts">
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { app } from "$lib/app/state.svelte";
  import type { ColorFullSet } from "$lib/app/types";
  import { isCursorInside, moveItem, passive } from "./utils";

  import FlyIcon from "~icons/lucide-lab/butterfly";
  import HandleBarIcon from "~icons/lucide/align-justify";

  type Props = {
    value: string;
  };

  let { value = $bindable() }: Props = $props();

  // variables related to dragging
  let isDragging = $state(false);
  let currentDraggedSet = $state<string | undefined>();
  let currentPosition: number;
  let cursor: HTMLElement;
  let container: HTMLElement;
  let itemRects: DOMRect[] = [];

  // flip variables
  const FLIP_DURATION = 200;
  let isFlipping: number | undefined; // not a boolean but used like one

  function onDragStart(event: MouseEvent, set: string, index: number) {
    event.preventDefault();

    isDragging = true;
    currentDraggedSet = set;
    currentPosition = index;

    // add event listeners for dragging
    document.addEventListener("mousemove", onDragging);
    document.addEventListener("mouseup", onDragEnd);
    document.addEventListener("touchmove", onTouchDragging, { passive: false });
    document.addEventListener("touchend", onDragEnd);
    document.addEventListener("visibilitychange", onDragEnd);

    // call once to set the cursor positions
    onDragging(event);
  }

  // make sure everything we used for dragging is cleared
  function onDragEnd() {
    isDragging = false;
    isFlipping = undefined;
    currentDraggedSet = undefined;
    clearTimeout(isFlipping);

    document.removeEventListener("mousemove", onDragging);
    document.removeEventListener("mouseup", onDragEnd);
    document.removeEventListener("visibilitychange", onDragEnd);
    document.removeEventListener("touchmove", onTouchDragging);
    document.removeEventListener("touchend", onDragEnd);
  }

  function onDragging(event: MouseEvent) {
    // Get the container's bounding rectangle
    const containerRect = container.getBoundingClientRect();

    // Calculate the mouse position relative to the container
    const relativeX = event.clientX - containerRect.left;
    const relativeY = event.clientY - containerRect.top;

    cursor.style.left = `${relativeX}px`;
    cursor.style.top = `${relativeY}px`;

    let arr: ColorFullSet[] = app.theme;

    // make sure no flips are happening before updating the list we use for calculations
    // if a flip is happening we freeze updating the item rects to prevent calculating moving items
    if (typeof isFlipping === "undefined") {
      itemRects = Array.from(
        container
          .querySelectorAll(`[data-set]`)
          .values()
          .map((el) => el.getBoundingClientRect()),
      );
    }

    // check for every item if cursor has entered them, if so make it so we move the currently dragged
    // item over.
    for (let i = 0; i < itemRects.length; i++) {
      if (currentPosition !== i) {
        if (isCursorInside(event, itemRects[i])) {
          arr = moveItem(arr, currentPosition, i);
          currentPosition = i;

          // reset flip timeout
          clearTimeout(isFlipping);
          isFlipping = setTimeout(() => {
            isFlipping = undefined;
          }, FLIP_DURATION);
        }
      }
    }

    // if we have changes, the theme should change, otherwise no re-render will happen
    app.theme = arr;
  }

  function onTouchDragStart(e: TouchEvent, set: string, index: number) {
    if (e.touches.length > 1) return; // Ignore multi-touch
    const touch = e.touches[0];
    onDragStart(
      {
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => e.preventDefault(),
      } as unknown as MouseEvent,
      set,
      index,
    );
  }

  function onTouchDragging(e: TouchEvent) {
    if (e.touches.length > 1) return;
    const touch = e.touches[0];
    onDragging({
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => e.preventDefault(),
    } as unknown as MouseEvent);
  }
</script>

<div class="p-4 space-y-6">
  <div class="space-y-2">
    <div class="text-2xl font-bold">Color Sets</div>
    <p class="text-sm text-background-700-300">All the colors of your theme is placed here.</p>
  </div>
  <ul bind:this={container} class="space-y-2 relative">
    {#each app.theme as set, i (set.name)}
      <li
        animate:flip={{ duration: FLIP_DURATION }}
        style="--self: {set[500]}"
        class="relative z-0 transition {currentDraggedSet === set.name && 'opacity-50 scale-95'}"
        data-set={set.name}
      >
        <button
          onclick={() => (value = set.name)}
          class="flex w-full items-center gap-5 p-3 rounded-lg hover:bg-background-100-900/50 transition {value ===
            set.name && '!bg-background-100-900'}"
        >
          <span class="bg-(--self) rounded-lg w-7 h-7"></span>
          <span>{set.name}</span>
        </button>
        <button
          use:passive={{ event: "touchstart", listener: (e) => onTouchDragStart(e, set.name, i) }}
          onmousedown={(e) => onDragStart(e, set.name, i)}
          class="right-4 top-1/2 -translate-y-1/2 absolute text-background-700-300/50 hover:bg-background-200-800 rounded p-1.5"
        >
          <HandleBarIcon />
        </button>
      </li>
    {/each}

    <div class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" bind:this={cursor}>
      {#if isDragging}
        <div class="p-1 rounded-full bg-foreground-500 text-background-50" transition:scale={{ duration: 100 }}>
          <FlyIcon />
        </div>
      {/if}
    </div>
  </ul>
</div>
