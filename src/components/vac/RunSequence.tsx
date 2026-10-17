import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BinHole, Brick, Coin, Piggy, Vac, type BrickColor } from './parts';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RunSequenceProps {
  tokenSymbol: string;
  escrow: number;
  threshold: number;
  claimedETH: number;
  keptETH: number;
  routerName: string;
}

interface Step {
  name: string;
  body: ReactNode;
  readingLabel: string;
  reading: string;
}

/* where things stand on the stage, as fractions of it */
const DOCK: [number, number] = [0.17, 0.6];
const PILE: [number, number] = [0.52, 0.5];
const BIN: [number, number] = [0.83, 0.74];
const PIG: [number, number] = [0.84, 0.22];

const PILE_BRICKS: Array<{ dx: number; dy: number; w: number; h: number; c: BrickColor; r: number }> = [
  { dx: -0.07, dy: -0.12, w: 2, h: 4, c: 'red', r: 20 },
  { dx: 0.05, dy: -0.15, w: 2, h: 2, c: 'yellow', r: -10 },
  { dx: 0.09, dy: 0.04, w: 1, h: 4, c: 'white', r: 70 },
  { dx: -0.03, dy: 0.1, w: 2, h: 3, c: 'green', r: -35 },
  { dx: -0.11, dy: 0.05, w: 1, h: 2, c: 'black', r: 0 },
  { dx: 0.02, dy: -0.01, w: 2, h: 2, c: 'orange', r: 45 },
];

/**
 * One run, held on screen while you scroll: the dock charges from trades, Vac undocks,
 * sweeps up the $VAC it bought, and drops it in the bin. The last beat shows the other
 * kind of run: the change goes in the piggy bank.
 */
export function RunSequence({ tokenSymbol, escrow, threshold, claimedETH, keptETH, routerName }: RunSequenceProps) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  const steps: Step[] = [
    {
      name: 'Every trade charges the dock',
      body: <>Buy or sell {tokenSymbol} and a small creator fee in ETH lands in the fee escrow. That is the charge ring around Vac’s dock.</>,
      readingLabel: 'charge right now',
      reading: `${escrow.toFixed(4)} / ${threshold ? threshold.toFixed(2) : '0.01'} ETH`,
    },
    {
      name: 'Full charge, Vac wakes up',
      body: <>When the escrow hits the line, the bot claims it. Bin runs fire at 0.01 ETH, piggy-bank runs at 0.02 ETH.</>,
      readingLabel: 'claimed so far',
      reading: `${claimedETH.toFixed(4)} ETH`,
    },
    {
      name: `It buys ${tokenSymbol} off the floor`,
      body: <>On a bin run the whole charge is spent buying {tokenSymbol} at market. Vac rolls out and sucks it all up.</>,
      readingLabel: 'buying on',
      reading: routerName,
    },
    {
      name: 'Into the bin',
      body: <>Everything Vac picked up goes in the bin at 0x…dEaD. Nobody holds the key, so the bin never gets emptied.</>,
      readingLabel: 'the bin',
      reading: '0x000…dEaD',
    },
    {
      name: 'Every other run: the piggy bank',
      body: <>The next run skips the bin: the fees go to the project wallet. It is in the log like every other run.</>,
      readingLabel: 'in the piggy bank',
      reading: `${keptETH.toFixed(4)} ETH`,
    },
  ];

  useGSAP(
    () => {
      const st = stage.current!;
      const W = () => st.clientWidth;
      const H = () => st.clientHeight;
      const px = (f: [number, number]) => ({ x: () => f[0] * W(), y: () => f[1] * H() });

      // put every moving part in place (also the still picture when motion is off)
      const place = () => {
        gsap.set('[data-st-vac]', { ...px(DOCK), xPercent: -50, yPercent: -50 });
        gsap.utils.toArray<HTMLElement>('[data-st-brick]').forEach((el, i) => {
          const b = PILE_BRICKS[i];
          gsap.set(el, { x: () => (PILE[0] + b.dx) * W(), y: () => (PILE[1] + b.dy) * H(), xPercent: -50, yPercent: -50, rotation: b.r, scale: 1 });
        });
        gsap.utils.toArray<HTMLElement>('[data-st-coin]').forEach((el, i) => {
          gsap.set(el, { x: () => (0.04 + i * 0.05) * W(), y: () => (0.1 + (i % 2) * 0.08) * H(), xPercent: -50, yPercent: -50, scale: 1, opacity: 1 });
        });
        gsap.set('[data-st-pigcoin]', { ...px(DOCK), xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
        gsap.set('[data-st-drop]', { ...px(BIN), xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
      };

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: reduce)', () => {
        place();
        gsap.set('[data-st-ring]', { strokeDashoffset: 0 });
        gsap.set('[data-st-coin]', { opacity: 0 });
        gsap.set('[data-step]', { opacity: 1, gridArea: 'auto', marginBottom: '2rem' });
        gsap.set('[data-pip]', { backgroundColor: 'var(--color-ring)' });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        place();
        const C = 2 * Math.PI * 46;
        gsap.set('[data-st-ring]', { strokeDasharray: C, strokeDashoffset: C });
        gsap.set('[data-step]', { autoAlpha: 0, y: 24 });
        gsap.set('[data-step="0"]', { autoAlpha: 1, y: 0 });

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=320%',
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const show = (i: number, at: number | string) => {
          // the old step is gone before the new one arrives, so two never overlap half-faded
          tl.to(`[data-step="${i - 1}"]`, { autoAlpha: 0, y: -24, duration: 0.14 }, at);
          tl.to(`[data-step="${i}"]`, { autoAlpha: 1, y: 0, duration: 0.2 }, '>');
          tl.to(`[data-pip="${i}"]`, { backgroundColor: 'var(--color-ring)', scale: 1, duration: 0.2 }, '<');
        };

        // 1: trades charge the dock
        tl.addLabel('charge', 0);
        tl.to('[data-st-coin]', { ...px([DOCK[0], DOCK[1] - 0.04]), scale: 0.3, opacity: 0, stagger: 0.12, duration: 0.5, ease: 'power2.in' }, 0.1);
        tl.to('[data-st-ring]', { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0.1);

        // 2: full, Vac wakes
        show(1, 1.25);
        tl.addLabel('full', '<');
        tl.to('[data-st-ring]', { stroke: 'var(--color-ring-hot)', duration: 0.2 }, '<');
        tl.to('[data-st-vac]', { scale: 1.12, duration: 0.18, yoyo: true, repeat: 3, ease: 'power1.inOut' }, '<');

        // 3: undock and sweep the pile
        show(2, 2.4);
        tl.addLabel('sweep', '<');
        tl.to('[data-st-ring]', { strokeDashoffset: C, duration: 0.5 }, '<');
        tl.to('[data-st-vac]', { rotation: 90, duration: 0.2 }, '<');
        tl.to('[data-st-vac]', { x: () => (PILE[0] - 0.1) * W(), y: () => PILE[1] * H(), duration: 0.6 }, '<0.15');
        gsap.utils.toArray<HTMLElement>('[data-st-brick]').forEach((el, i) => {
          tl.to(el, { x: () => (PILE[0] - 0.06 + i * 0.02) * W(), y: () => PILE[1] * H(), scale: 0, rotation: '+=220', duration: 0.3, ease: 'power3.in' }, `<${i === 0 ? 0.35 : 0.1}`);
        });
        tl.to('[data-st-vac]', { x: () => (PILE[0] + 0.1) * W(), duration: 0.5, ease: 'none' }, '<-0.4');

        // 4: to the bin, and in it goes
        show(3, 4.0);
        tl.addLabel('bin', '<');
        tl.to('[data-st-vac]', { rotation: 140, duration: 0.2 }, '<');
        tl.to('[data-st-vac]', { x: () => (BIN[0] - 0.13) * W(), y: () => (BIN[1] - 0.05) * H(), duration: 0.5 }, '<0.1');
        tl.fromTo('[data-st-drop]', { x: () => (BIN[0] - 0.1) * W(), y: () => (BIN[1] - 0.05) * H(), scale: 1, opacity: 1 }, { ...px(BIN), scale: 0, opacity: 1, rotation: 260, stagger: 0.12, duration: 0.45, ease: 'power2.in' }, '>');
        tl.to('[data-st-bin]', { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1 }, '>-0.1');

        // 5: the other kind of run, the piggy bank
        show(4, 5.6);
        tl.addLabel('piggy', '<');
        tl.to('[data-st-vac]', { rotation: 20, duration: 0.2 }, '<');
        tl.to('[data-st-vac]', { x: () => (PIG[0] - 0.14) * W(), y: () => (PIG[1] + 0.12) * H(), duration: 0.6 }, '<0.1');
        tl.fromTo('[data-st-pigcoin]', { x: () => (PIG[0] - 0.1) * W(), y: () => (PIG[1] + 0.08) * H(), scale: 1, opacity: 1 }, { x: () => (PIG[0] - 0.01) * W(), y: () => (PIG[1] - 0.06) * H(), scale: 0.5, opacity: 0, duration: 0.45, ease: 'power2.in' }, '>');
        tl.to('[data-st-vac]', { ...px(DOCK), rotation: 0, duration: 0.7 }, '>0.1');
        tl.addLabel('end');
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const C = 2 * Math.PI * 46;

  return (
    <section ref={root} id="run" aria-labelledby="run-title" className="relative px-2 pb-2 pt-[4.25rem] sm:px-3 sm:pb-3 sm:pt-[4.75rem]">
      <div className="well grid min-h-[calc(100svh-4.75rem)] motion-safe:content-center gap-5 overflow-hidden px-4 py-5 sm:min-h-[calc(100svh-5.5rem)] sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:items-start lg:gap-12 lg:px-12 lg:motion-safe:items-center">
        {/* the stage: one cell of the tray, seen from above */}
        <div ref={stage} className="cell relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10] lg:motion-reduce:sticky lg:motion-reduce:top-24" aria-hidden="true">
          <div className="absolute" style={{ left: `${DOCK[0] * 100}%`, top: `${DOCK[1] * 100}%`, width: '24%', aspectRatio: '1', transform: 'translate(-50%,-50%)' }}>
            <div className="absolute inset-x-[30%] bottom-[-3%] top-[72%] rounded-b-[12px] rounded-t-[6px] bg-vac" />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(6,18,72,0.5)" strokeWidth="6" />
              <circle data-st-ring cx="50" cy="50" r="46" fill="none" stroke="var(--color-ring)" strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={0} />
            </svg>
          </div>

          <div data-st-bin className="absolute w-[17%]" style={{ left: `${BIN[0] * 100}%`, top: `${BIN[1] * 100}%`, transform: 'translate(-50%,-50%)' }}>
            <BinHole className="block h-auto w-full" />
          </div>
          <span className="absolute font-mono text-[clamp(0.6rem,1.1vw,0.8rem)] text-star-dim" style={{ left: `${BIN[0] * 100}%`, top: `${(BIN[1] + 0.15) * 100}%`, transform: 'translateX(-50%)' }}>
            0x…dEaD
          </span>

          <div className="absolute w-[17%]" style={{ left: `${PIG[0] * 100}%`, top: `${PIG[1] * 100}%`, transform: 'translate(-50%,-50%)' }}>
            <Piggy className="block h-auto w-full" />
          </div>
          <span className="absolute whitespace-nowrap pxl text-[clamp(0.6rem,1.1vw,0.8rem)] text-fuel" style={{ left: `${PIG[0] * 100}%`, top: `${(PIG[1] + 0.13) * 100}%`, transform: 'translateX(-50%)' }}>
            project wallet
          </span>

          {PILE_BRICKS.map((b, i) => (
            <div key={i} data-st-brick className="absolute left-0 top-0" style={{ width: `${b.w * 2.6}%` }}>
              <Brick w={b.w} h={b.h} color={b.c} className="block h-auto w-full" />
            </div>
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} data-st-coin className="absolute left-0 top-0 w-[4.5%]">
              <Coin className="block h-auto w-full" />
            </div>
          ))}
          {(['red', 'yellow', 'green'] as const).map((c) => (
            <div key={c} data-st-drop className="absolute left-0 top-0 w-[5%] opacity-0">
              <Brick w={2} h={3} color={c} className="block h-auto w-full" />
            </div>
          ))}
          <div data-st-pigcoin className="absolute left-0 top-0 w-[4.5%] opacity-0">
            <Coin className="block h-auto w-full" />
          </div>
          <div data-st-vac className="absolute left-0 top-0 w-[19%]">
            <Vac className="block h-auto w-full" running />
          </div>
        </div>

        <div className="relative">
          <h2 id="run-title" className="m-0 display text-[clamp(2.4rem,4.6vw,4.2rem)] text-star">
            How a run works
          </h2>
          <div className="mt-4 flex gap-2 sm:mt-6" aria-hidden="true">
            {steps.map((_, i) => (
              <span key={i} data-pip={i} className={`h-3 w-7 rounded-[4px] ${i === 0 ? 'bg-ring' : 'bg-[rgba(6,18,72,0.45)]'}`} />
            ))}
          </div>
          <ol className="relative m-0 mt-4 grid list-none p-0 [grid-template-areas:'s'] sm:mt-6">
            {steps.map((s, i) => (
              <li key={s.name} data-step={i} className="[grid-area:s]">
                <h3 className="m-0 display text-[clamp(1.7rem,2.6vw,2.4rem)] text-ring">{s.name}</h3>
                <p className="m-0 mt-3 max-w-[40ch] text-[1.08rem] leading-relaxed text-star">{s.body}</p>
                <div className="mt-5 inline-flex items-baseline gap-3 rounded-[10px] bg-[rgba(6,18,72,0.35)] px-4 py-2.5">
                  <span className="pxl text-[0.8rem] text-star-dim">{s.readingLabel}</span>
                  <span className="font-mono text-[0.95rem] tabular text-star">{s.reading}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
