import { useMemo, useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Check, Copy, ExternalLink, ScrollText } from 'lucide-react';
import type { ActivityLog, BurnLedgerEntry } from '../../types';
import { Piggy } from './parts';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface BinLogProps {
  burnLedger: BurnLedgerEntry[];
  logs: ActivityLog[];
  totalBurned: number;
  tokenSymbol: string;
  deadAddress: string;
  explorerUrl: string;
  copiedDead: boolean;
  onCopyDead: () => void;
  onOpenLog: () => void;
}

const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.floor(n));
const compact = (n: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1, roundingMode: 'floor' } as Intl.NumberFormatOptions).format(n);
const shortHash = (h: string) => `${h.slice(0, 6)}…${h.slice(-4)}`;
const when = (e: BurnLedgerEntry) => {
  // ledger timestamps from the chain are in seconds
  const ms = e.timestamp && e.timestamp < 1e12 ? e.timestamp * 1000 : e.timestamp;
  const d = ms ? new Date(ms) : null;
  if (!d || Number.isNaN(d.getTime())) return e.timeStr?.split(' (')[0] ?? '';
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
};
const burned = (e: BurnLedgerEntry) => e.burnedJollyburn || e.burnedMuseburn || e.burnedIncinerator || 0;

interface PiggyRun {
  key: string;
  eth: number;
  time: string;
  tx: string;
}

/** The gap a brick leaves behind: its outline, studs and all, in dashes. */
function Gap({ w, h, className, style }: { w: number; h: number; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox={`-1 -1 ${w * 10 + 2} ${h * 10 + 2}`} className={className} style={style} aria-hidden="true">
      <rect width={w * 10} height={h * 10} rx="1.4" fill="none" stroke="rgba(244,246,255,0.32)" strokeWidth="0.7" strokeDasharray="2 1.6" />
      {Array.from({ length: w * h }, (_, i) => (
        <circle key={i} cx={(i % w) * 10 + 5} cy={Math.floor(i / w) * 10 + 5} r="3" fill="none" stroke="rgba(244,246,255,0.22)" strokeWidth="0.6" strokeDasharray="1.4 1.2" />
      ))}
    </svg>
  );
}

const GAPS: Array<[number, number]> = [
  [2, 4],
  [2, 2],
  [1, 4],
  [2, 3],
  [2, 2],
  [1, 3],
  [2, 4],
];

/**
 * The bin log: every run that went in the bin is an emptied compartment, tagged with its
 * run, its size and its transaction, read from Robinhood Chain. Piggy-bank runs sit beside it.
 */
export function BinLog({ burnLedger, logs, totalBurned, tokenSymbol, deadAddress, explorerUrl, copiedDead, onCopyDead, onOpenLog }: BinLogProps) {
  const root = useRef<HTMLElement>(null);

  const runs = useMemo(() => {
    const chrono = [...burnLedger].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    return chrono
      .filter((e) => e.cycleType !== 'keep' && (burned(e) > 0 || e.burnTx))
      .map((e, i) => ({ e, n: i + 1 }))
      .reverse();
  }, [burnLedger]);

  // piggy runs: keep entries from the ledger, plus the bot's "forwarded … to treasury" log lines
  const piggy = useMemo(() => {
    const out: PiggyRun[] = [];
    const seen = new Set<string>();
    for (const e of burnLedger) {
      if (e.cycleType !== 'keep') continue;
      const tx = e.claimTx || '';
      seen.add(tx || e.id);
      out.push({ key: e.id, eth: e.retainedETH || e.claimedETH || 0, time: when(e), tx });
    }
    for (const l of logs) {
      const m = /forwarded\s+([\d.]+)\s*ETH\s+to\s+treasury/i.exec(l.details || '');
      if (!m) continue;
      const tx = l.txHash || '';
      const key = tx || l.id;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ key, eth: parseFloat(m[1]) || 0, time: l.timestamp, tx });
    }
    return out;
  }, [burnLedger, logs]);

  // the lead run takes a 2x2 compartment, so five fill two full rows of four
  const shown = runs.slice(0, 5);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // compartments are pressed into the tray as they come into view
        ScrollTrigger.batch('[data-compartment]', {
          start: 'top 90%',
          once: true,
          onEnter: (els) => gsap.fromTo(els, { y: 40, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.07 }),
        });
        ScrollTrigger.batch('[data-tag]', {
          start: 'top 90%',
          once: true,
          onEnter: (els) => gsap.fromTo(els, { rotate: -14, scale: 1.4, opacity: 0 }, { rotate: (i) => (i % 2 ? 3 : -4), scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.4)', stagger: 0.07, delay: 0.25 }),
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [shown.length] },
  );

  return (
    <section ref={root} id="bin" aria-labelledby="bin-title" className="relative px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="well px-4 pb-10 pt-16 sm:px-8 lg:px-12 lg:pb-14 lg:pt-24">
        <div className="max-w-[44rem]">
          <h2 id="bin-title" className="m-0 display text-[clamp(2.6rem,5.4vw,4.8rem)] text-star">
            The bin log
          </h2>
          <p className="m-0 mt-5 max-w-[56ch] text-[1.08rem] leading-relaxed text-star-dim">
            Every bin run leaves a gap in the tray. Each one is tagged with its run, the {tokenSymbol} that went in, and its transaction, read straight from Robinhood Chain.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.95rem] text-star-dim">
          <span className="pxl">
            bin runs <span className="font-mono text-ring">{runs.length}</span>
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <span className="pxl">the bin</span>
            <span className="truncate font-mono text-star" title={deadAddress}>
              {deadAddress.slice(0, 8)}…{deadAddress.slice(-6)}
            </span>
            <button type="button" onClick={onCopyDead} className="brick-white cursor-pointer px-3 py-1.5 text-[0.8rem]">
              {copiedDead ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedDead ? 'copied' : 'copy'}
            </button>
          </span>
        </div>

        {shown.length === 0 ? (
          <div data-compartment className="cell mt-8 flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:p-10">
            <div className="flex shrink-0 gap-3">
              <Gap w={2} h={4} className="h-24 w-12" />
              <Gap w={2} h={2} className="h-12 w-12 self-end" />
              <Gap w={1} h={3} className="h-[4.5rem] w-6" />
            </div>
            <p className="m-0 max-w-[48ch] text-[1.1rem] leading-relaxed text-star">
              {totalBurned > 0 ? `${compact(totalBurned)} ${tokenSymbol} already went in. Reading the runs from the chain now.` : 'Nothing in the bin yet. The first run shows up here with its transaction.'}
            </p>
          </div>
        ) : (
          <ol className="m-0 mt-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4" aria-label="Recent bin runs">
            {shown.map(({ e, n }, i) => {
              const tx = e.burnTx || e.buyTx || e.claimTx;
              const amt = burned(e);
              const lead = i === 0;
              const [gw, gh] = GAPS[(n - 1) % GAPS.length];
              return (
                <li key={e.id} data-compartment className={`cell flex min-h-[11rem] flex-col justify-between gap-6 p-5 sm:p-6 ${lead ? 'sm:col-span-2 lg:row-span-2 lg:min-h-[23rem]' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <Gap w={gw} h={gh} className={lead ? 'h-28 w-auto sm:h-36' : 'h-14 w-auto'} style={{ aspectRatio: `${gw + 0.2} / ${gh + 0.2}` }} />
                    <span data-tag className="label-sticker rotate-[-4deg] px-3 py-1.5 pxl text-[0.85rem]">
                      run {n}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className={`display tabular text-star ${lead ? 'text-[clamp(2.6rem,4.6vw,4.4rem)]' : 'text-[clamp(1.7rem,2.4vw,2.2rem)]'}`}>
                      {fmt(amt)} <span className="text-[0.55em] text-ring">{tokenSymbol}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="font-mono text-[0.85rem] text-star-dim">{when(e)}</span>
                      {tx && tx.startsWith('0x') ? (
                        <a href={`${explorerUrl}/tx/${tx}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[0.85rem] text-ring underline decoration-ring/40">
                          {shortHash(tx)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        <button type="button" onClick={onOpenLog} className="brick-white mt-6 cursor-pointer px-5 py-3 text-[0.95rem]">
          <ScrollText className="h-4 w-4" />
          open the full log
        </button>

        <div id="piggy" className="mt-16 grid gap-8 border-t-2 border-[rgba(6,18,72,0.35)] pt-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-end">
          <div className="flex items-end gap-5">
            <Piggy className="h-auto w-24 shrink-0 sm:w-28" />
            <div>
              <h3 className="m-0 display text-[clamp(2rem,3.2vw,2.8rem)] text-fuel">The piggy bank</h3>
              <p className="m-0 mt-3 max-w-[44ch] text-[1.03rem] leading-relaxed text-star-dim">
                Every other run skips the bin and the fees go to the project wallet. Those runs are written up here in full.
              </p>
            </div>
          </div>
          {piggy.length === 0 ? (
            <p className="m-0 text-[1rem] leading-relaxed text-star-dim">No piggy-bank run in the recent log. The next one shows up here with its transaction. Older ones are in the project wallet’s history.</p>
          ) : (
            <ol className="m-0 grid list-none gap-2 p-0">
              {piggy.slice(0, 4).map((f) => (
                <li key={f.key} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-[12px] bg-[rgba(6,18,72,0.3)] px-4 py-3">
                  <span className="tabular font-mono text-[1rem] text-star">{f.eth.toFixed(4)} ETH</span>
                  <span className="font-mono text-[0.85rem] text-star-dim">{f.time}</span>
                  {f.tx && f.tx.startsWith('0x') ? (
                    <a href={`${explorerUrl}/tx/${f.tx}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[0.85rem] text-fuel underline decoration-fuel/40">
                      {shortHash(f.tx)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
