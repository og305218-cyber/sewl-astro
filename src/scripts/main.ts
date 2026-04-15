import { initLenis } from './lenis';
import { initScrollTrigger, gsap, ScrollTrigger } from './gsap';

let initialized = false;

function setupPageAnimations() {
  const lenis = initLenis();

  if (!initialized) {
    initScrollTrigger(lenis);
    initialized = true;
  }

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  const reveals = document.querySelectorAll<HTMLElement>('[data-scroll-reveal]');
  reveals.forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        delay: i * 0.04,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      },
    );
  });

  const heroTitle = document.querySelector<HTMLElement>('[data-hero-parallax]');
  if (heroTitle) {
    gsap.to(heroTitle, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroTitle,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  ScrollTrigger.refresh();
}

document.addEventListener('DOMContentLoaded', setupPageAnimations);
document.addEventListener('astro:page-load', setupPageAnimations);
