import { useMemo, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BinHole, Brick, seeded, type BrickColor } from './parts';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COLORS: BrickColor[] = ['red', 'yellow', 'white', 'green', 'orange', 'black'];
const WORD = 'THE VACUUM'.split('');

/**
 * The close: the whole floor goes down the bin. Bricks circle in from every side,
 * then the name itself is pulled apart and sucked in, and the last label is left.
 */
export function VortexFinale({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const orbs = useMemo(() => {
    const rnd = seeded(7);
    return Array.from({ length: 30 }, (_, i) => ({
      angle: (i / 30) * 360 + rnd() * 10,
      r: 20 + rnd() * 34, // vmin from the centre
      w: 1 + Math.floor(rnd() * 2),
      h: 2 + Math.floor(rnd() * 3),
      c: COLORS[i % COLORS.length],
      spin: Math.round(rnd() * 360),
    }));
  }, []);

  useGSAP(
    () => {
      const vmin = () => Math.min(window.innerWidth, window.innerHeight) / 100;
      // the still picture: bricks in their ring
      gsap.utils.toArray<HTMLElement>('[data-orb]').forEach((el, i) => gsap.set(el, { y: () => -orbs[i].r * vmin() }));

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set('[data-final-label]', { autoAlpha: 0, scale: 0.7, y: 40 });
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true },
        });
        tl.fromTo('[data-final-bin]', { scale: 0.55 }, { scale: 1, duration: 0.2, ease: 'power2.out' }, 0);
        gsap.utils.toArray<HTMLElement>('[data-orbit]').forEach((el, i) => {
          const o = orbs[i];
          const at = 0.08 + (1 - (o.r - 20) / 34) * 0.08 + (i % 5) * 0.04;
          tl.to(el, { rotation: `+=${300 + o.r * 6}`, duration: 0.45, ease: 'power1.in' }, at);
          tl.to(el.querySelector('[data-orb]'), { y: 0, scale: 0, rotation: o.spin + 540, duration: 0.45, ease: 'power3.in' }, at);
        });
        // the name comes apart, letter by letter, into the hole
        gsap.utils.toArray<HTMLElement>('[data-vletter]').forEach((el, i) => {
          tl.to(
            el,
            {
              x: () => {
                const r = el.getBoundingClientRect();
                return window.innerWidth / 2 - (r.left + r.width / 2) + Number(gsap.getProperty(el, 'x'));
              },
              y: () => {
                const r = el.getBoundingClientRect();
                return window.innerHeight / 2 - (r.top + r.height / 2) + Number(gsap.getProperty(el, 'y'));
              },
              scale: 0,
              rotation: (i % 2 ? 1 : -1) * 260,
              duration: 0.22,
              ease: 'power3.in',
            },
            0.5 + Math.abs(i - (WORD.length - 1) / 2) * 0.03,
          );
        });
        // the bin shrinks and settles just above the last label, still in view
        const BIN_END = 0.42;
        const binSize = () => BIN_END * (root.current!.querySelector('[data-final-bin]') as HTMLElement).offsetWidth;
        // how far the label must sit below centre so the bin above it clears the nav (72px)
        const labelDrop = () => {
          const half = (root.current!.querySelector('[data-final-label]') as HTMLElement).offsetHeight / 2;
          const room = window.innerHeight / 2 - 72 - 12;
          return Math.max(binSize() / 2 + 14, half + binSize() + 14 - room);
        };
        tl.to(
          '[data-final-bin]',
          {
            scale: BIN_END,
            y: () => -((root.current!.querySelector('[data-final-label]') as HTMLElement).offsetHeight / 2 + binSize() / 2 + 14) + labelDrop(),
            duration: 0.14,
            ease: 'power2.inOut',
          },
          0.8,
        );
        tl.to('[data-final-label]', { autoAlpha: 1, scale: 1, y: () => labelDrop(), duration: 0.14, ease: 'back.out(1.6)' }, 0.86);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="exit-title" className="relative px-2 pb-2 motion-safe:h-[280svh] sm:px-3 sm:pb-3">
      <div className="well-deep well relative flex min-h-[calc(100svh-1rem)] items-center justify-center overflow-hidden px-4 py-24 motion-safe:sticky motion-safe:top-2 motion-safe:h-[calc(100svh-1rem)] motion-safe:py-0 sm:motion-safe:top-3 sm:motion-safe:h-[calc(100svh-1.5rem)]">
        <div data-final-bin className="pointer-events-none absolute left-1/2 top-1/2 -ml-[min(19vmin,11rem)] -mt-[min(19vmin,11rem)] w-[min(38vmin,22rem)]" aria-hidden="true">
          <BinHole className="block h-auto w-full" />
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
          {orbs.map((o, i) => (
            <div key={i} data-orbit className="absolute left-0 top-0" style={{ transform: `rotate(${o.angle}deg)` }}>
              <div data-orb className="absolute" style={{ width: `${o.w * 2.6}vmin`, marginLeft: `${-o.w * 1.3}vmin`, marginTop: `${-o.h * 1.3}vmin`, transform: `translateY(${-o.r}vmin) rotate(${o.spin}deg)` }}>
                <Brick w={o.w} h={o.h} color={o.c} className="block h-auto w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* the name, across the top, above the bricks, until it goes in too */}
        <p className="pointer-events-none absolute inset-x-0 top-[11%] z-[5] m-0 flex motion-reduce:hidden justify-center box-type text-[clamp(3.4rem,13vw,11rem)] text-paper" aria-hidden="true">
          {WORD.map((ch, i) => (
            <span key={i} data-vletter className={`inline-block ${ch === ' ' ? 'w-[0.3em]' : ''}`}>
              {ch === ' ' ? '' : ch}
            </span>
          ))}
        </p>

        <div data-final-label className="label-sticker relative z-10 mx-auto w-full max-w-[40rem] px-6 py-8 text-center sm:px-10 sm:py-10">
          {children}
        </div>
      </div>
    </section>
  );
}
