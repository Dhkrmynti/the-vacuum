import type { BurnLedgerEntry } from '../../types';

/**
 * Synthetic runs for previewing the bin log before launch. Dev server only, and only with
 * `?demo` in the URL: none of these amounts or hashes are real.
 */
export function demoLedger(): BurnLedgerEntry[] | null {
  if (!import.meta.env.DEV || typeof window === 'undefined' || !new URLSearchParams(window.location.search).has('demo')) return null;
  const now = Math.floor(Date.now() / 1000);
  const amounts = [1824113, 942870, 1310455, 2207390, 610212, 1486022];
  const hash = (i: number) => `0x${(i * 7919 + 4099).toString(16).padStart(8, '0')}${'demo'.repeat(14)}`.slice(0, 66);
  const out: BurnLedgerEntry[] = [];
  amounts.forEach((amt, i) => {
    const t = now - (amounts.length - i) * 5400;
    out.push({ id: `demo-burn-${i}`, cycleNum: i * 2 + 1, cycleType: 'burn', timeStr: '', timestamp: t, claimedETH: 0.01, claimedUSD: 0, boughtETH: 0.01, boughtUSD: 0, burnedJollyburn: amt, claimTx: hash(i), burnTx: hash(i + 50) });
    out.push({ id: `demo-keep-${i}`, cycleNum: i * 2 + 2, cycleType: 'keep', timeStr: '', timestamp: t + 2700, claimedETH: 0.02, claimedUSD: 0, boughtETH: 0, boughtUSD: 0, retainedETH: 0.02, claimTx: hash(i + 90) });
  });
  return out;
}
