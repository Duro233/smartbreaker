import { useEffect } from "react";

type UseScrollRevealOptions = {
  selector?: string;
  threshold?: number;
  rootMargin?: string;
};

export function useScrollReveal(options: UseScrollRevealOptions = {}): void {
  const {
    selector = "[data-reveal], .reveal-on-scroll",
    threshold = 0.2,
    rootMargin = "0px 0px -12% 0px",
  } = options;

  useEffect(() => {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    );

    if (revealElements.length === 0) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      revealElements.forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target as HTMLElement;
          const delay = Number(element.dataset.revealDelay ?? "0");

          if (!Number.isNaN(delay) && delay > 0) {
            element.style.transitionDelay = `${delay}ms`;
          }

          element.classList.add("is-visible");
          activeObserver.unobserve(element);
        });
      },
      { threshold, rootMargin },
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [rootMargin, selector, threshold]);
}
