<!-- A somewhat rudimentary and yet slightly hacky dnd'abble list -->
<script lang="ts">
  import { Spring } from "svelte/motion";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { app } from "$lib/app/state.svelte";
  import { isCursorInside, passive } from "./utils";

  import FlyIcon from "~icons/lucide-lab/butterfly";
  import HandleBarIcon from "~icons/lucide/align-justify";

  const cursorPosition = new Spring({ x: 0, y: 0 }, { stiffness: 0.2, damping: 0.4 });

  // variables related to dragging
  let isDragging = $state(false);
  let currentDraggedSet = $state<string | undefined>();
  let currentPosition: number;
  let container: HTMLElement;
  let itemRects: DOMRect[] = [];

  // moving-related variables
  const FLIP_DURATION = 200;
  const DEBOUNCE_MOVE_DURATION = 50;
  let movingTo: number | undefined;
  let debounceMoveTimeout: number | undefined;
  let flippingTimeout: number | undefined; // not a boolean but used like one

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
    moveCursorPosition(event, true);
  }

  // make sure everything we used for dragging is cleared
  function onDragEnd() {
    clearTimeout(debounceMoveTimeout);
    clearTimeout(flippingTimeout);

    isDragging = false;
    debounceMoveTimeout = undefined;
    flippingTimeout = undefined;
    currentDraggedSet = undefined;
    movingTo = undefined;

    document.removeEventListener("mousemove", onDragging);
    document.removeEventListener("mouseup", onDragEnd);
    document.removeEventListener("visibilitychange", onDragEnd);
    document.removeEventListener("touchmove", onTouchDragging);
    document.removeEventListener("touchend", onDragEnd);
  }

  function moveCursorPosition(coords: { clientX: number; clientY: number }, instant?: boolean) {
    // Get the container's bounding rectangle
    const containerRect = container.getBoundingClientRect();

    // Calculate the mouse position relative to the container
    const relativeX = coords.clientX - containerRect.left;
    const relativeY = coords.clientY - containerRect.top;
    cursorPosition.set({ x: relativeX, y: relativeY }, { instant });
  }

  function onDragging(event: MouseEvent) {
    event.preventDefault();
    moveCursorPosition(event);

    // make sure no flips are happening before updating the list we use for calculations
    // if a flip is happening we freeze updating the item rects to prevent calculating moving items
    if (typeof flippingTimeout === "undefined") {
      itemRects = Array.from(
        container
          .querySelectorAll(`[data-set]`)
          .values()
          .map((el) => el.getBoundingClientRect()),
      );
    }

    // check for every item if cursor has entered them,
    // if so make it so we move the currently dragged item over.
    for (let i = 0; i < itemRects.length; i++) {
      if (currentPosition !== i && movingTo !== i && isCursorInside(event, itemRects[i])) {
        movingTo = i;
        clearTimeout(debounceMoveTimeout);
        debounceMoveTimeout = setTimeout(() => {
          app.reorderColorSet(currentPosition, i);
          currentPosition = i;

          // reset flip timeout here since this marks when items are flipping
          clearTimeout(flippingTimeout);
          flippingTimeout = setTimeout(() => (flippingTimeout = undefined), FLIP_DURATION);
        }, DEBOUNCE_MOVE_DURATION);
      }
    }
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

<div class="space-y-6">
  <div class="space-y-2">
    <div class="text-2xl font-bold">Color Sets</div>
    <p class="text-sm text-background-700-300 font-light">All the colors of your theme is placed here.</p>
  </div>
  <div class="relative" bind:this={container}>
    <!-- added `overflow-y-hidden` to avoid firefox glitching -->
    <ul class="space-y-2 overflow-y-clip py-1">
      {#each app.theme as set, i (set.id)}
        <li
          animate:flip={{ duration: FLIP_DURATION }}
          style="--self: {set[500]}"
          class="relative z-0 transition {currentDraggedSet === set.name && 'opacity-50 scale-95'}"
          data-set
        >
          <button
            onclick={() => (app.currentId = set.id)}
            class="flex w-full items-center gap-5 p-3 rounded-lg hover:bg-background-100-900/50 transition {app.currentId ===
              set.id && '!bg-background-100-900'}"
          >
            <span class="bg-(--self) rounded-lg w-7 h-7"></span>
            <span>{set.name}</span>
          </button>
          <button
            use:passive={{ event: "touchstart", listener: (e) => onTouchDragStart(e, set.name, i) }}
            onmousedown={(e) => onDragStart(e, set.name, i)}
            class="right-4 top-1/2 -translate-y-1/2 absolute text-background-700-300/50 hover:bg-background-200-800/50 rounded p-1.5"
          >
            <HandleBarIcon />
          </button>
        </li>
      {/each}
    </ul>

    <div
      class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
      style="top: {cursorPosition.current.y}px; left: {cursorPosition.current.x}px"
    >
      {#if isDragging}
        <div class="w-40 h-40 flex items-center justify-center">
          <div class="p-1 rounded-full bg-foreground-500 text-background-50" transition:scale={{ duration: 100 }}>
            <FlyIcon />
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
