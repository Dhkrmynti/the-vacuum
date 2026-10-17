import { ScrollText } from 'lucide-react';
import type { FlywheelState, MachineConfig } from '../../types';
import { Vac } from './parts';

interface VacStatusProps {
  state: FlywheelState;
  config: MachineConfig;
  live: boolean;
  onOpenLog: () => void;
}

const PHASE: Record<string, string> = {
  accumulate: 'charging on the dock',
  claim: 'claiming the escrow',
  buyback: 'buying $VAC off the floor',
  burn: 'emptying into the bin',
  keep: 'feeding the piggy bank',
};

/** What the bot is doing right now, read from the engine, printed on Vac's own parts label. */
export function VacStatus({ state, config, live, onOpenLog }: VacStatusProps) {
  const doing = !live ? 'asleep until the contract address is set' : state.isWheelSpinning ? PHASE[state.currentPhase] ?? 'on a run' : 'charging on the dock';
  const rows = [
    { k: 'runs done', v: String(state.cycleCount || 0) },
    { k: 'next run', v: state.nextCycleType === 'keep' ? 'piggy bank at 0.02 ETH' : 'the bin at 0.01 ETH' },
    { k: 'buys on', v: state.swapRouter === 'uniswap' || state.isTokenMigrated ? 'Uniswap v4' : 'Pons curve' },
    { k: 'ETH claimed', v: `${(state.totalFeesClaimedETH || 0).toFixed(4)} ETH` },
  ];

  return (
    <section id="vac" aria-labelledby="vac-title" className="relative px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="well grid gap-10 overflow-hidden px-4 py-16 sm:px-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-16 lg:px-12 lg:py-24">
        <div className="relative mx-auto w-[min(16rem,60vw)] lg:mx-0 lg:w-[20rem]">
          <Vac className={`block h-auto w-full ${state.isWheelSpinning ? '' : 'vac-idle'}`} running={state.isWheelSpinning} eyeOff={!live} />
        </div>

        <div className="min-w-0">
          <h2 id="vac-title" className="m-0 display text-[clamp(2.6rem,5.4vw,4.8rem)] text-star">
            Vac, right now
          </h2>
          <p className="m-0 mt-4 max-w-[52ch] text-[1.08rem] leading-relaxed text-star-dim">
            Vac is the bot. It watches the fee escrow around the clock, claims it at full charge, and does the run on its own. Every move lands on chain.
          </p>

          {/* the label stuck on Vac's lid: one sticker, read top to bottom */}
          <div className="label-sticker mt-8 max-w-[38rem] rotate-[0.8deg] px-5 py-5 sm:px-7 sm:py-6">
            <p className={`m-0 display text-[clamp(1.6rem,2.8vw,2.3rem)] ${state.isWheelSpinning ? 'text-marker' : 'text-pen'}`} aria-live="polite">
              {doing}
            </p>
            {live && state.lastActionText ? <p className="m-0 mt-2 line-clamp-2 text-[0.92rem] text-pen-soft">{state.lastActionText}</p> : null}
            <dl className="m-0 mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-t-2 border-dashed border-grid pt-4">
              {rows.map((r) => (
                <div key={r.k}>
                  <dt className="pxl text-[0.85rem] text-pen-soft">{r.k}</dt>
                  <dd className="m-0 mt-0.5 font-mono text-[0.95rem] tabular text-pen">{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <button type="button" onClick={onOpenLog} className="brick-white mt-8 cursor-pointer px-5 py-3 text-[0.95rem]">
            <ScrollText className="h-4 w-4" />
            open the full log
          </button>
        </div>
      </div>
    </section>
  );
}
