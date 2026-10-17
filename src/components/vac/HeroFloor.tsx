import { forwardRef, useImperativeHandle, useMemo, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Brick, Vac, scatter } from './parts';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface HeroFloorHandle {
  /** Drop one brick in front of Vac and let it eat it. */
  nibble: () => void;
}

interface HeroFloorProps {
  label: ReactNode;
  dockReadout: ReactNode;
  fill: number;
  nextCycle: 'burn' | 'keep';
  running: boolean;
  live: boolean;
}

/** The route Vac sweeps when you scroll off the first view, as fractions of the floor. */
const ROUTE: Array<[number, number]> = [
  [0.95, 0.1],
  [0.64, 0.06],
  [0.32, 0.1],
  [0.05, 0.16],
  [0.08, 0.55],
  [0.06, 0.93],
  [0.4, 0.95],
  [0.74, 0.9],
  [0.96, 0.82],
  [0.86, 0.5],
  [0.52, 0.46],
];

const NIBBLES = 4;

/**
 * The first view: one big well of the tray with bricks all over it, the parts label,
 * and Vac on its dock. Scrolling off it, the view holds while Vac sweeps the whole floor,
 * sucking in every brick and finally the label, then lets go.
 */
export const HeroFloor = forwardRef<HeroFloorHandle, HeroFloorProps>(function HeroFloor({ label, dockReadout, fill, nextCycle, running, live }, ref) {
  const root = useRef<HTMLElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  const vac = useRef<HTMLDivElement>(null);
  const nibbleAt = useRef(0);
  const bricks = useMemo(() => scatter(34, 41, [[0.68, 0.3, 0.26, 0.5]]), []);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // arrival: the bricks rain onto the floor, the label is pressed on
        gsap.from('[data-brick-drop]', { y: -60, scale: 1.5, opacity: 0, duration: 0.7, ease: 'back.out(2.2)', stagger: { each: 0.025, from: 'random' }, delay: 0.15 });
        gsap.from('[data-label]', { y: 40, rotate: -6, opacity: 0, duration: 0.9, ease: 'expo.out', delay: 0.1 });
        gsap.from('[data-dock]', { scale: 0.6, opacity: 0, duration: 0.8, ease: 'back.out(1.8)', delay: 0.35 });

        const fl = floor.current!;
        const v = vac.current!;
        // where Vac sits in the dock, as a fraction of the floor
        const home = () => {
          const f = fl.getBoundingClientRect();
          const r = v.getBoundingClientRect();
          return [(r.left + r.width / 2 - f.left) / f.width, (r.top + r.height / 2 - f.top) / f.height] as [number, number];
        };
        let start = home();
        const pts = () => [start, ...ROUTE];
        const lens = () => {
          const p = pts();
          const out: number[] = [];
          for (let i = 1; i < p.length; i++) out.push(Math.hypot((p[i][0] - p[i - 1][0]) * 1.6, p[i][1] - p[i - 1][1]));
          return out;
        };
        // a point along the route at t in 0..1
        const along = (t: number): [number, number] => {
          const p = pts();
          const l = lens();
          const total = l.reduce((a, b) => a + b, 0);
          let d = t * total;
          for (let i = 0; i < l.length; i++) {
            if (d <= l[i]) {
              const k = d / l[i];
              return [p[i][0] + (p[i + 1][0] - p[i][0]) * k, p[i][1] + (p[i + 1][1] - p[i][1]) * k];
            }
            d -= l[i];
          }
          return p[p.length - 1];
        };
        const SWEEP = 0.86; // the share of the hold Vac spends on the route

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              gsap.set(v, { x: 0, y: 0, rotation: 0 });
              start = home();
            },
          },
        });

        // Vac: one keyframe per stretch of the route, turning to face where it goes
        const p0 = pts();
        const l0 = lens();
        const total0 = l0.reduce((a, b) => a + b, 0);
        let heading = 0;
        for (let i = 1; i < p0.length; i++) {
          const dx = p0[i][0] - p0[i - 1][0];
          const dy = p0[i][1] - p0[i - 1][1];
          let ang = (Math.atan2(dy * 0.62, dx) * 180) / Math.PI + 90;
          while (ang - heading > 180) ang -= 360;
          while (ang - heading < -180) ang += 360;
          heading = ang;
          const dur = (l0[i - 1] / total0) * SWEEP;
          const at = l0.slice(0, i - 1).reduce((a, b) => a + b, 0) / total0 * SWEEP;
          tl.to(v, { rotation: ang, duration: Math.min(0.03, dur) }, at);
          tl.to(
            v,
            {
              x: () => (pts()[i][0] - start[0]) * fl.clientWidth,
              y: () => (pts()[i][1] - start[1]) * fl.clientHeight,
              duration: dur,
            },
            at,
          );
        }

        // every brick is pulled in when Vac passes closest to it
        gsap.utils.toArray<HTMLElement>('[data-brick]').forEach((el) => {
          const bx = Number(el.dataset.x);
          const by = Number(el.dataset.y);
          let best = 0;
          let bestD = Infinity;
          for (let s = 0; s <= 200; s++) {
            const [px, py] = along(s / 200);
            const d = Math.hypot((px - bx) * 1.6, py - by);
            if (d < bestD) {
              bestD = d;
              best = s / 200;
            }
          }
          const t = Math.max(0, best * SWEEP - 0.025);
          tl.to(
            el,
            {
              x: () => (along(best)[0] - bx) * fl.clientWidth,
              y: () => (along(best)[1] - by) * fl.clientHeight,
              scale: 0,
              rotation: 200,
              ease: 'power3.in',
              duration: 0.035,
            },
            t,
          );
        });

        // last of all, the label goes in
        const end = ROUTE[ROUTE.length - 1];
        tl.to(
          '[data-label]',
          {
            x: () => {
              const f = fl.getBoundingClientRect();
              const r = (fl.querySelector('[data-label]') as HTMLElement).getBoundingClientRect();
              return end[0] * f.width - (r.left - f.left + r.width / 2) + Number(gsap.getProperty('[data-label]', 'x'));
            },
            y: () => {
              const f = fl.getBoundingClientRect();
              const r = (fl.querySelector('[data-label]') as HTMLElement).getBoundingClientRect();
              return end[1] * f.height - (r.top - f.top + r.height / 2) + Number(gsap.getProperty('[data-label]', 'y'));
            },
            scale: 0.04,
            rotation: -40,
            ease: 'power2.in',
            duration: 1 - SWEEP + 0.04,
          },
          SWEEP - 0.04,
        );
        tl.to('[data-dock-readout]', { opacity: 0, duration: 0.05 }, 0.05);
        tl.to({}, { duration: 0.06 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  useImperativeHandle(ref, () => ({
    nibble: contextSafe(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const el = root.current?.querySelectorAll<HTMLElement>('[data-nibble]')[nibbleAt.current % NIBBLES];
      if (!el) return;
      nibbleAt.current += 1;
      const side = nibbleAt.current % 2 ? 1 : -1;
      gsap
        .timeline()
        .set(el, { opacity: 1, scale: 1, x: side * 70, y: -150, rotation: side * 40 })
        .to(el, { y: -86, rotation: side * 15, duration: 0.45, ease: 'bounce.out' })
        .to(el, { x: 0, y: -10, scale: 0, rotation: side * 220, duration: 0.32, ease: 'power3.in' }, '+=0.25')
        .to(vac.current, { scale: 1.06, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.out' }, '-=0.04')
        .set(el, { opacity: 0 });
    }),
  }));

  const C = 2 * Math.PI * 46;
  const ringColor = nextCycle === 'burn' ? 'var(--color-ring)' : 'var(--color-fuel)';

  return (
    <section ref={root} data-hero aria-labelledby="hero-title" className="relative px-2 pb-2 pt-[4.25rem] sm:px-3 sm:pb-3 sm:pt-[4.75rem]">
      <div ref={floor} className="well relative min-h-[calc(100svh-4.75rem)] overflow-hidden sm:min-h-[calc(100svh-5.5rem)]">
        {/* the loose bricks */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {bricks.map((b, i) => (
            <div
              key={i}
              data-brick
              data-x={b.x}
              data-y={b.y}
              className={`absolute ${i % 3 === 2 ? 'hidden sm:block' : ''}`}
              style={{ left: `${b.x * 100}%`, top: `${b.y * 100}%`, width: `${b.w * b.size}rem`, height: `${b.h * b.size}rem`, marginLeft: `${(-b.w * b.size) / 2}rem`, marginTop: `${(-b.h * b.size) / 2}rem` }}
            >
              <div data-brick-drop className="h-full w-full">
                <Brick w={b.w} h={b.h} color={b.color} className="block h-full w-full" style={{ transform: `rotate(${b.rot}deg)` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="relative grid min-h-[inherit] gap-8 px-4 pb-8 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-6 lg:px-12 lg:py-10">
          <div data-label className="relative z-10 max-w-[40rem] origin-center">
            {label}
          </div>

          <div className="relative z-20 flex flex-col items-center justify-center gap-5 pb-4">
            <div data-dock className="relative grid aspect-square w-[min(15rem,62vw)] place-items-center lg:w-[min(19rem,26vw)]">
              {/* the dock slab under Vac */}
              <div className="absolute inset-x-[30%] bottom-[-3%] top-[72%] rounded-b-[18px] rounded-t-[8px] bg-vac shadow-[0_14px_26px_-10px_rgba(6,18,72,0.7)]" aria-hidden="true">
                <span className="absolute bottom-[28%] left-1/2 h-1.5 w-[46%] -translate-x-1/2 rounded-full bg-eye/70" />
              </div>
              {/* the charge ring: the fee escrow toward the next run */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(6,18,72,0.5)" strokeWidth="5" />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke={live ? ringColor : '#4b5060'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - Math.max(0.015, fill))}
                  style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
                />
              </svg>
              <div ref={vac} data-vac className="relative z-10 w-[74%]">
                <div className={running ? '' : 'vac-idle'}>
                  <Vac className="block h-auto w-full" running={running} eyeOff={!live} />
                </div>
              </div>
              {Array.from({ length: NIBBLES }, (_, i) => (
                <div key={i} data-nibble className="pointer-events-none absolute left-1/2 top-1/2 z-20 -ml-4 -mt-6 h-12 w-8 opacity-0" aria-hidden="true">
                  <Brick w={2} h={3} color={(['red', 'yellow', 'green', 'white'] as const)[i]} className="block h-full w-full" />
                </div>
              ))}
            </div>
            <div data-dock-readout className="mt-3 w-full max-w-[22rem]">
              {dockReadout}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
