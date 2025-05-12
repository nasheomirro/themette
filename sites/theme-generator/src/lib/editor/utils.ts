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
