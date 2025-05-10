import type { ActionReturn } from "svelte/action";

/** checks if the given mouse event is inside the rect */
export function isCursorInside(event: MouseEvent, rect: DOMRect): boolean {
  return (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
}

/** Returns a new array where value at `index` has been inserted into `target` */
export function moveItem<T>(arr: T[], index: number, target: number): T[] {
  // Validate index and target
  if (index < 0 || index >= arr.length || target < 0 || target >= arr.length) {
    throw new Error("Index or target out of bounds");
  }

  // Copy the array to avoid mutating the original
  const newArr = [...arr];
  const [item] = newArr.splice(index, 1); // Remove the item from its current position
  newArr.splice(target, 0, item); // Insert it at the target position
  return newArr;
}

/**
 * Because svelte doesn't support "passive" event listeners, we'll do this instead
 * https://svelte.dev/docs/svelte/v5-migration-guide#Event-changes-Event-modifiers
 */
export function passive<T extends keyof WindowEventMap>(
  node: HTMLElement,
  param: { event: T; listener: (e: WindowEventMap[T]) => void },
): ActionReturn<{ event: T; listener: (e: WindowEventMap[T]) => void }> {
  let listener = param.listener as any;
  node.addEventListener(param.event, listener);

  return {
    update: ({ listener: _listener }) => {
      node.removeEventListener(param.event, listener);
      listener = _listener;

      node.addEventListener(param.event, listener);
    },
    destroy: () => node.removeEventListener(param.event, param.listener as any),
  };
}
