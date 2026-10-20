export const qs = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(sel);

export const qsa = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll<T>(sel));

export const clamp = (v: number, min = 0, max = 1): number => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const reducedMotion = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = (): boolean => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

type FrameFn = (time: number) => void;
const frameFns = new Set<FrameFn>();

/** Um único requestAnimationFrame para todos os efeitos da página. */
export function onFrame(fn: FrameFn): () => void {
  frameFns.add(fn);
  if (frameFns.size === 1) requestAnimationFrame(tick);
  return () => frameFns.delete(fn);
}

function tick(time: number): void {
  frameFns.forEach((fn) => fn(time));
  if (frameFns.size) requestAnimationFrame(tick);
}
