import Lenis from '@studio-freight/lenis';

let lenis: Lenis | null = null;
let rafStarted = false;

export function initLenis() {
  if (lenis) {
    return lenis;
  }

  lenis = new Lenis({
    duration: 1.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  if (!rafStarted) {
    const raf = (time: number) => {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
    rafStarted = true;
  }

  return lenis;
}

export function getLenis() {
  return lenis;
}
