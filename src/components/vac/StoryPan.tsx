import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BinHole, Brick, Vac, type BrickColor } from './parts';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Placed = { x: number; y: number; w: number; h: number; c: BrickColor; r?: number; s?: number };

/* the city: a block of bricks built on the rug, in % of a square stage */
const CITY: Placed[] = [
  { x: 22, y: 18, w: 2, h: 4, c: 'red' },
  { x: 36, y: 18, w: 2, h: 4, c: 'red' },
  { x: 29, y: 44, w: 4, h: 2, c: 'white', r: 0 },
  { x: 58, y: 16, w: 2, h: 2, c: 'yellow' },
  { x: 58, y: 32, w: 2, h: 2, c: 'yellow' },
  { x: 72, y: 24, w: 2, h: 6, c: 'black' },
  { x: 20, y: 66, w: 2, h: 2, c: 'green' },
  { x: 34, y: 70, w: 1, h: 4, c: 'orange' },
  { x: 52, y: 62, w: 4, h: 2, c: 'red' },
  { x: 56, y: 80, w: 2, h: 2, c: 'white' },
  { x: 76, y: 70, w: 2, h: 3, c: 'yellow' },
  { x: 85, y: 50, w: 1, h: 2, c: 'green' },
];
const HUM: Placed[] = [
  { x: 22, y: 22, w: 2, h: 4, c: 'yellow', r: 30 },
  { x: 80, y: 26, w: 2, h: 2, c: 'green', r: -20 },
  { x: 78, y: 80, w: 1, h: 4, c: 'white', r: 70 },
  { x: 50, y: 12, w: 2, h: 4, c: 'red', r: 8, s: 0.55 },
  { x: 18, y: 76, w: 2, h: 3, c: 'black', r: -40 },
];
const RIM: Placed[] = [
  { x: 24, y: 30, w: 2, h: 4, c: 'red', r: 35, s: 0.9 },
  { x: 74, y: 22, w: 2, h: 2, c: 'yellow', r: -25, s: 0.8 },
  { x: 80, y: 66, w: 1, h: 4, c: 'white', r: 60, s: 0.75 },
  { x: 30, y: 76, w: 2, h: 3, c: 'green', r: -50, s: 0.7 },
  { x: 58, y: 38, w: 2, h: 2, c: 'orange', r: 20, s: 0.4 },
  { x: 44, y: 58, w: 1, h: 2, c: 'black', r: 80, s: 0.3 },
];

function Bricks({ set, unit = 3.4 }: { set: Placed[]; unit?: number }) {
  return (
    <>
      {set.map((b, i) => (
        <div
          key={i}
          data-scene-brick
          className="absolute"
          style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w * unit * (b.s ?? 1)}%`, transform: `translate(-50%,-50%) rotate(${b.r ?? 0}deg)` }}
        >
          <Brick w={b.w} h={b.h} color={b.c} className="block h-auto w-full" />
        </div>
      ))}
    </>
  );
}

const CHAPTERS: Array<{ title: string; text: string; scene: ReactNode }> = [
  {
    title: 'The city',
    text: 'On day one, a kid built a whole city out of $VAC bricks on the living-room floor. Then went to bed and left it there.',
    scene: <Bricks set={CITY} unit={4.2} />,
  },
  {
    title: 'The hum',
    text: 'That night, something hummed by the couch. A robot vacuum woke on its dock, blinked one amber eye, and ate a red 2x4. Its name is Vac.',
    scene: (
      <>
        <Bricks set={HUM} unit={4.2} />
        <div className="absolute left-1/2 top-[56%] w-[46%] -translate-x-1/2 -translate-y-1/2">
          <Vac className="block h-auto w-full" running />
        </div>
      </>
    ),
  },
  {
    title: 'The bin',
    text: 'Every night since, every $VAC trade charges the dock. At full charge Vac rolls out, buys $VAC and drops it in the bin at 0x…dEaD. Nobody empties the bin.',
    scene: (
      <>
        <div className="absolute left-1/2 top-1/2 w-[58%] -translate-x-1/2 -translate-y-1/2">
          <BinHole className="block h-auto w-full" />
        </div>
        <Bricks set={RIM} unit={4.2} />
      </>
    ),
  },
];

/**
 * How Vac got here: three chapters laid along the floor. On wide screens the section
 * holds and the floor pans sideways as you scroll; on phones it stacks.
 */
export function StoryPan() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const dist = () => Math.max(0, track.current!.scrollWidth - root.current!.clientWidth + 24);
        const pan = gsap.to(track.current, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        // inside each chapter, the scene drifts against the pan so the floor has depth
        gsap.utils.toArray<HTMLElement>('[data-scene]').forEach((el) => {
          gsap.fromTo(el, { x: 60 }, { x: -60, ease: 'none', scrollTrigger: { trigger: el, containerAnimation: pan, start: 'left right', end: 'right left', scrub: true } });
        });
      });
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-chapter]').forEach((el) => {
          gsap.from(el, { y: 50, opacity: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="story" aria-labelledby="story-title" className="relative overflow-hidden px-2 pb-2 sm:px-3 sm:pb-3 lg:pt-[4.75rem]">
      <div className="well overflow-hidden py-16 lg:flex lg:min-h-[calc(100svh-5.5rem)] lg:flex-col lg:justify-center lg:py-10">
        <h2 id="story-title" className="m-0 px-4 display text-[clamp(2.6rem,5.4vw,4.8rem)] text-star sm:px-8 lg:px-12">
          How Vac got here
        </h2>
        <div ref={track} className="mt-10 flex flex-col gap-4 px-4 sm:px-8 lg:mt-12 lg:w-max lg:flex-row lg:gap-6 lg:px-12">
          {CHAPTERS.map((c, i) => (
            <article key={c.title} data-chapter className="cell grid shrink-0 items-center gap-6 overflow-hidden p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:p-8 lg:w-[min(68vw,62rem)]">
              <div data-scene className="relative mx-auto aspect-square w-full max-w-[24rem]" aria-hidden="true">
                {c.scene}
              </div>
              <div>
                <h3 className="m-0 display text-[clamp(2.2rem,3.6vw,3.4rem)] text-star">{c.title}</h3>
                <p className="m-0 mt-4 max-w-[34ch] text-[1.12rem] leading-relaxed text-star">{c.text}</p>
                {i === CHAPTERS.length - 1 ? <p className="m-0 mt-5 pxl text-[0.95rem] text-star-dim">Vac is still out there tonight.</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
