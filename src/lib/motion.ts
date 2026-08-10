import { useMemo } from 'react';
import { useReducedMotion, type Transition } from 'framer-motion';

/**
 * Motion vocabulary — Apple's fluid-interface physics, translated to the web.
 *
 * Apple designs springs with two parameters: damping ratio (overshoot) and
 * response (how quickly the value reaches its target). Motion takes `bounce`
 * and `duration`, which map onto those directly. A spring has no fixed
 * duration — settle time emerges from the parameters — so `duration` here is
 * "response", not "how long the animation lasts".
 *
 * Default to critically damped (bounce 0). Overshoot is only earned when the
 * gesture itself carried momentum: a flick, a throw, a drag release.
 */

export const spring = {
  /** Anything a pointer touches. damping 1.0 / response 0.3 */
  snappy: { type: 'spring', bounce: 0, duration: 0.3 },
  /** Move / reposition. damping 1.0 / response 0.4 */
  standard: { type: 'spring', bounce: 0, duration: 0.4 },
  /** Large surfaces settling into a detent. */
  gentle: { type: 'spring', bounce: 0, duration: 0.55 },
  /** Post-flick only — the gesture carried momentum, so bounce is honest. */
  momentum: { type: 'spring', bounce: 0.2, duration: 0.4 },
} as const;

/**
 * Non-vestibular equivalent for `prefers-reduced-motion`. Reduced motion means
 * a gentler feedback, not *no* feedback — opacity still carries meaning.
 */
export const crossFade: Transition = { duration: 0.2, ease: [0.4, 0, 0.2, 1] };

/**
 * Where a flick is going, not where it was released.
 *
 * This is Apple's exponential-decay projection from the Designing Fluid
 * Interfaces sample code — deliberately not the textbook v²/(2·a), which
 * produces a noticeably different (and wrong-feeling) landing point.
 *
 * @param velocity px/s at release
 * @param decelerationRate 0.998 for normal scroll feel, 0.99 for snappier
 */
export const project = (velocity: number, decelerationRate = 0.998) =>
  ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);

/**
 * Progressive resistance past a boundary. A hard stop reads as frozen;
 * continuous resistance reads as "responsive, but there's nothing more here".
 */
export const rubberband = (overshoot: number, dimension: number, constant = 0.55) =>
  (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));

/** Clamp a drag offset, rubber-banding rather than hard-stopping outside [min, max]. */
export const withRubberband = (value: number, min: number, max: number, dimension: number) => {
  if (value < min) return min - rubberband(min - value, dimension);
  if (value > max) return max + rubberband(value - max, dimension);
  return value;
};

export const nearestSnap = (value: number, points: number[]) =>
  points.reduce((best, point) =>
    Math.abs(point - value) < Math.abs(best - value) ? point : best,
  );

/**
 * The full release handoff: project the endpoint from velocity, then choose
 * the detent nearest that projection. The caller hands the same raw velocity
 * to the spring so there's no seam between dragging and animating.
 */
export const snapTarget = (
  current: number,
  velocity: number,
  points: number[],
  decelerationRate = 0.998,
) => nearestSnap(current + project(velocity, decelerationRate), points);

/**
 * Spring presets that respect the user's motion preference. JS-driven springs
 * don't see the CSS media query, so every consumer reads them from here.
 */
export const useTransitions = () => {
  const reduced = useReducedMotion();

  return useMemo(
    () => ({
      reduced: Boolean(reduced),
      snappy: reduced ? crossFade : spring.snappy,
      standard: reduced ? crossFade : spring.standard,
      gentle: reduced ? crossFade : spring.gentle,
      momentum: reduced ? crossFade : spring.momentum,
    }),
    [reduced],
  );
};

/** Shared reveal variants — a short rise, or a plain fade under reduced motion. */
export const revealVariants = (reduced: boolean, distance = 24) => ({
  hidden: { opacity: 0, y: reduced ? 0 : distance },
  visible: { opacity: 1, y: 0 },
});
