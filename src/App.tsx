import { useState, useEffect, useRef } from 'react';
import { useFlywheelEngine } from './hooks/useBurnEngine';
import { PONS_V2_CONFIG } from './contracts';
import { sounds } from './utils/audio';
import { Volume2, VolumeX, Copy, Check, ArrowUpRight, ScrollText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BurnLedgerDrawer } from './components/BurnLedgerDrawer';
import { MemexAdmin } from './components/MemexAdmin';
import { LiveNumber } from './components/vac/LiveNumber';
import { Vac } from './components/vac/parts';
import { HeroFloor, type HeroFloorHandle } from './components/vac/HeroFloor';
import { RunSequence } from './components/vac/RunSequence';
import { BinLog } from './components/vac/BinLog';
import { VacStatus } from './components/vac/VacStatus';
import { StoryPan } from './components/vac/StoryPan';
import { VortexFinale } from './components/vac/VortexFinale';
import { demoLedger } from './components/vac/demo';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/** What Vac says when it eats one. */
const VAC_SAYS = [
  'beep.',
  'crunch.',
  'that was a 2x4.',
  'odd runs: the bin. even runs: the piggy bank.',
  'keep trading. i am charging.',
  'the floor is looking thin.',
  'no take-backs.',
  'nobody empties the bin.',
];

/** X account for the project: empty until there is one. */
const X_URL = '';
const EXPLORER_URL = 'https://explorer.mainnet.chain.robinhood.com';
/** Where to trade and where to watch, once the CA is known. */
const buyUrl = (ca: string) => (ca ? `https://ponsfamily.com/launchpad/${ca}` : EXPLORER_URL);
const chartUrl = (ca: string) => (ca ? `https://dexscreener.com/robinhood/${ca}` : EXPLORER_URL);

export function App() {
  const { state, config, setConfig, logs, burnLedger: liveLedger } = useFlywheelEngine();
  const [demo] = useState(demoLedger);
  const burnLedger = demo ?? liveLedger;

  const getIsMemex = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.startsWith('/memex') || hash.startsWith('#memex') || hash.startsWith('#/memex');
  };

  const [isMemexRoute, setIsMemexRoute] = useState(getIsMemex());
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [copiedCA, setCopiedCA] = useState(false);
  const [copiedDead, setCopiedDead] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [fed, setFed] = useState(0);
  const [sayIndex, setSayIndex] = useState(0);
  const heroRef = useRef<HeroFloorHandle>(null);

  useEffect(() => {
    const handleLocationChange = () => setIsMemexRoute(getIsMemex());
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // the nav gets its plastic once the page moves
  useEffect(() => {
    if (isMemexRoute) return;
    const st = ScrollTrigger.create({ start: 24, end: 'max', onToggle: (self) => setScrolled(self.isActive) });
    return () => st.kill();
  }, [isMemexRoute]);

  // Late fonts change line heights; re-measure every trigger once they land
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  // While the bot is really on a run, Vac keeps eating
  useEffect(() => {
    if (!state.isWheelSpinning) return;
    const id = window.setInterval(() => heroRef.current?.nibble(), 1800);
    return () => window.clearInterval(id);
  }, [state.isWheelSpinning]);

  const feedOne = () => {
    setFed((prev) => prev + 1);
    setSayIndex((prev) => (prev + 1) % VAC_SAYS.length);
    heroRef.current?.nibble();
    sounds.playBuybackSound();
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setIsMemexRoute(false);
  };

  const threshold = state.currentThresholdETH || state.claimThresholdETH || config.claimThresholdETH || 0;
  const escrow = state.currentEscrowBalanceETH || 0;
  const charge = threshold > 0 ? Math.max(0, Math.min(1, escrow / threshold)) : 0;

  if (isMemexRoute) {
    return <MemexAdmin onBack={navigateToHome} />;
  }

  const copyCA = () => {
    if (!config.tokenAddress) return;
    navigator.clipboard.writeText(config.tokenAddress);
    setCopiedCA(true);
    sounds.playClaimSound();
    setTimeout(() => setCopiedCA(false), 2500);
  };

  const copyDead = () => {
    navigator.clipboard.writeText(config.deadAddress || PONS_V2_CONFIG.contracts.deadAddress);
    setCopiedDead(true);
    sounds.playBurnSound();
    setTimeout(() => setCopiedDead(false), 2000);
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.floor(num));

  const totalTokensBurned =
    state.totalTokensBurned > 0
      ? state.totalTokensBurned
      : burnLedger.reduce((acc, cur) => acc + (cur.burnedJollyburn || cur.burnedMuseburn || cur.burnedIncinerator || 0), 0);

  const burnedPercent =
    state.burnedPercentageOfSupply > 0
      ? state.burnedPercentageOfSupply
      : state.totalSupply > 0
        ? (totalTokensBurned / state.totalSupply) * 100
        : 0;

  const tokenSymbol = '$VAC';
  const deadAddress = config.deadAddress || PONS_V2_CONFIG.contracts.deadAddress;
  const isConfigured = Boolean(config.tokenAddress && config.tokenAddress.startsWith('0x') && config.tokenAddress.length === 42);
  const nextCycle = state.nextCycleType || 'burn';
  const routerName = state.swapRouter === 'uniswap' || state.isTokenMigrated ? 'Uniswap v4' : 'the Pons bonding curve';
  const running = state.isWheelSpinning;

  const dockStatus = !isConfigured
    ? 'asleep until launch'
    : running
      ? nextCycle === 'burn'
        ? 'on a run: into the bin'
        : 'on a run: to the piggy bank'
      : charge >= 0.85
        ? 'almost fully charged'
        : 'charging from every trade';

  return (
    <div className="relative min-h-screen overflow-x-clip lip font-body text-star">
      {/* ───────── The nav ───────── */}
      <header className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300 ${scrolled ? 'bg-panel/95 shadow-[0_10px_24px_-14px_rgba(6,18,72,0.8)] backdrop-blur-sm' : ''}`}>
        <div className="mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateToHome();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-2.5 text-star no-underline"
            aria-label="The Vacuum home"
          >
            <Vac className="h-9 w-9 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[200deg]" />
            <span className="display text-[1.7rem] tracking-[-0.01em]">The Vacuum</span>
          </a>

          <nav className="hidden items-center gap-7 text-[0.98rem] font-semibold text-star md:flex" aria-label="Sections">
            <a href="#run" className="no-underline hover:text-ring">how it runs</a>
            <a href="#bin" className="no-underline hover:text-ring">the bin</a>
            <a href="#vac" className="no-underline hover:text-ring">vac</a>
            <a href="#story" className="no-underline hover:text-ring">the story</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setConfig({ ...config, soundEnabled: !config.soundEnabled })}
              title={config.soundEnabled ? 'Mute Vac' : 'Turn the sounds on'}
              aria-label={config.soundEnabled ? 'Mute Vac' : 'Turn the sounds on'}
              className="brick-white h-10 w-10 cursor-pointer"
            >
              {config.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            {X_URL ? (
              <a href={X_URL} target="_blank" rel="noreferrer" title="The Vacuum on X" aria-label="The Vacuum on X" className="btn-ghost h-10 w-10">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-6.4L6.5 22H3.4l7.2-8.2L2.9 2h6.4l4.4 5.8L18.9 2Zm-1.1 17.8h1.7L8.3 4.1H6.5l11.3 15.7Z" />
                </svg>
              </a>
            ) : null}
            <a href={buyUrl(config.tokenAddress)} target="_blank" rel="noreferrer" className="btn-ring hidden h-10 px-4 text-[0.92rem] no-underline sm:inline-flex">
              buy {tokenSymbol}
            </a>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* ───────── The floor, full of bricks ───────── */}
        <HeroFloor
          ref={heroRef}
          fill={charge}
          nextCycle={nextCycle}
          running={running}
          live={isConfigured}
          label={
            <div className="label-sticker rotate-[-1.2deg] px-5 pb-6 pt-6 sm:px-9 sm:pb-8 sm:pt-8">
              <h1 id="hero-title" className="m-0 box-type text-[clamp(4.2rem,10vw,7.6rem)] text-pen">
                The Vacuum
              </h1>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className={`display tabular text-[clamp(2.4rem,5vw,3.8rem)] ${isConfigured ? 'text-marker' : 'text-pen-soft'}`}>
                  <LiveNumber value={totalTokensBurned} format={(n) => formatNumber(n)} />
                </span>
                <span className="pxl text-[1.05rem] text-pen">{tokenSymbol} in the bin</span>
              </div>
              <p className="m-0 mt-1 text-[0.98rem] text-pen-soft">
                <span className="font-mono text-pen">{burnedPercent > 0 ? (Math.floor(burnedPercent * 100) / 100).toFixed(2) : '0.00'}%</span> of the supply. Not coming back.
              </p>
              <p className="m-0 mt-5 max-w-[44ch] text-[1.08rem] leading-relaxed text-pen">
                Every trade charges Vac. At full charge Vac buys {tokenSymbol} back and drops it in the bin at 0x…dEaD.
              </p>

              <div className="mt-6 flex flex-col gap-4">
                {config.tokenAddress ? (
                  <button type="button" onClick={copyCA} className="group flex min-w-0 cursor-pointer items-center justify-between gap-3 rounded-[12px] bg-paper-shade py-2 pl-4 pr-2 text-left transition-colors hover:bg-[#d7dcee]" title="Copy contract address">
                    <span className="min-w-0">
                      <span className="pxl block text-[0.78rem] text-pen-soft">contract address</span>
                      <span className="block truncate font-mono text-[0.82rem] text-pen">{config.tokenAddress}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 rounded-[8px] bg-pen px-3 py-2 text-[0.8rem] font-bold text-paper">
                      {copiedCA ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedCA ? 'copied' : 'copy'}
                    </span>
                  </button>
                ) : (
                  <p className="m-0 rounded-[12px] border-2 border-dashed border-grid px-4 py-3 text-[0.98rem] text-pen-soft">The contract address shows up here at launch.</p>
                )}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a href={buyUrl(config.tokenAddress)} target="_blank" rel="noreferrer" className="btn-ring px-6 py-3.5 text-[1.05rem] no-underline">
                    buy {tokenSymbol}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <a href={chartUrl(config.tokenAddress)} target="_blank" rel="noreferrer" className="brick-dark px-4 py-3 text-[0.95rem] no-underline">
                    chart
                  </a>
                  <button type="button" onClick={() => setIsLogOpen(true)} className="brick-dark cursor-pointer px-4 py-3 text-[0.95rem]" aria-label="Open the full log">
                    <ScrollText className="h-4 w-4" />
                    <span className="hidden sm:inline">log</span>
                  </button>
                </div>
              </div>
            </div>
          }
          dockReadout={
            <div className="text-center">
              <p className={`m-0 pxl text-[1rem] ${running ? 'text-ring' : 'text-star'}`} aria-live="polite">
                {dockStatus}
              </p>
              <p className="m-0 mt-1 font-mono text-[0.9rem] tabular text-star-dim">
                {escrow.toFixed(4)} / {threshold ? threshold.toFixed(2) : '0.01'} ETH
              </p>
              <p className="m-0 mt-1 text-[0.95rem] text-star-dim">
                next run: {nextCycle === 'burn' ? <b className="text-ring">into the bin</b> : <b className="text-fuel">the piggy bank</b>}
              </p>
              <div className="mt-4 flex min-h-[2.4rem] flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={sayIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="m-0 hand text-[1.05rem] text-star"
                  >
                    vac: “{VAC_SAYS[sayIndex]}”
                  </motion.p>
                </AnimatePresence>
                <button type="button" onClick={feedOne} className="brick-white cursor-pointer px-3.5 py-2 text-[0.85rem]">
                  feed vac a brick <span className="font-mono text-marker">{fed}</span>
                </button>
              </div>
            </div>
          }
        />

        {/* ───────── One run, held on screen ───────── */}
        <RunSequence tokenSymbol={tokenSymbol} escrow={escrow} threshold={threshold} claimedETH={state.totalFeesClaimedETH || 0} keptETH={state.totalFeesRetainedETH || 0} routerName={routerName} />

        {/* ───────── The bin log and the piggy bank ───────── */}
        <BinLog
          burnLedger={burnLedger}
          totalBurned={totalTokensBurned}
          logs={logs}
          tokenSymbol={tokenSymbol}
          deadAddress={deadAddress}
          explorerUrl={EXPLORER_URL}
          copiedDead={copiedDead}
          onCopyDead={copyDead}
          onOpenLog={() => setIsLogOpen(true)}
        />

        {/* ───────── What Vac is doing ───────── */}
        <VacStatus state={state} config={config} live={isConfigured} onOpenLog={() => setIsLogOpen(true)} />

        {/* ───────── How Vac got here ───────── */}
        <StoryPan />

        {/* ───────── The close: everything goes in the bin ───────── */}
        <VortexFinale>
          <h2 id="exit-title" className="m-0 box-type text-[clamp(2.8rem,6.4vw,5.2rem)] text-pen">
            Everything ends up in the bin.
          </h2>
          <p className="mx-auto mt-5 max-w-[40ch] text-[1.12rem] leading-relaxed text-pen">
            Hold {tokenSymbol}, trade {tokenSymbol}, and watch Vac clear the floor one run at a time.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <a href={buyUrl(config.tokenAddress)} target="_blank" rel="noreferrer" className="btn-ring px-8 py-4 text-[1.1rem] no-underline">
              buy {tokenSymbol}
              <ArrowUpRight className="h-5 w-5" />
            </a>
            {config.tokenAddress ? (
              <button type="button" onClick={copyCA} className="brick-dark cursor-pointer px-6 py-4 text-[1rem]">
                {copiedCA ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                {copiedCA ? 'copied' : 'copy CA'}
              </button>
            ) : null}
          </div>
        </VortexFinale>

        <footer className="relative px-2 pb-2 sm:px-3 sm:pb-3">
          <div className="flex flex-col gap-4 px-4 pb-8 pt-6 text-[0.95rem] text-star-dim sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-2.5">
              <Vac className="h-7 w-7" eyeOff={!isConfigured} />
              <span className="pxl text-star">{tokenSymbol} on Robinhood Chain</span>
            </div>
            <p className="m-0 max-w-[52ch]">Bin runs and piggy-bank runs are done by a bot and every one is on chain. A meme, not financial advice.</p>
            <div className="font-mono text-[0.82rem]">Chain ID 4663, {!isConfigured ? 'Vac asleep' : running ? 'run in progress' : 'Vac on the dock'}</div>
          </div>
        </footer>
      </main>

      <BurnLedgerDrawer isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} logs={logs} burnLedger={burnLedger} state={state} config={config} />
    </div>
  );
}

export default App;
