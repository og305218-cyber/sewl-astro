import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let isWired = false;

export function initScrollTrigger(lenis: { on: (event: string, cb: () => void) => void }) {
  if (isWired) {
    return;
  }

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.lagSmoothing(0);
  isWired = true;
}

export { gsap, ScrollTrigger };
