import type { CSSProperties } from 'react';

/** Brick colours: face, shaded edge, stud highlight. */
export const BRICK = {
  red: ['#e3262f', '#a8121b', '#ff7a7f'],
  yellow: ['#ffc21a', '#c98a00', '#ffe27a'],
  green: ['#1f9d55', '#0f6b36', '#5fd38e'],
  white: ['#eef0f6', '#b9bfd2', '#ffffff'],
  black: ['#2a2d36', '#15171c', '#545866'],
  orange: ['#ff7a1a', '#c2510a', '#ffb070'],
} as const;
export type BrickColor = keyof typeof BRICK;

const U = 10; // one stud

/** A brick seen from above: w by h studs, the shaded edge falling bottom-right. */
export function Brick({ w = 2, h = 4, color = 'red', className, style }: { w?: number; h?: number; color?: BrickColor; className?: string; style?: CSSProperties }) {
  const [face, edge, hi] = BRICK[color];
  const W = w * U;
  const H = h * U;
  return (
    <svg viewBox={`-1 -1 ${W + 3} ${H + 3}`} className={className} style={style} aria-hidden="true">
      <rect x="1.2" y="1.6" width={W} height={H} rx="1.4" fill="rgba(6,18,72,0.45)" />
      <rect width={W} height={H} rx="1.4" fill={edge} />
      <rect width={W - 0.9} height={H - 1.1} rx="1.2" fill={face} />
      {Array.from({ length: w * h }, (_, i) => {
        const cx = (i % w) * U + U / 2;
        const cy = Math.floor(i / w) * U + U / 2;
        return (
          <g key={i}>
            <circle cx={cx + 0.5} cy={cy + 0.7} r="3.1" fill={edge} />
            <circle cx={cx} cy={cy} r="3.1" fill={face} />
            <path d={`M ${cx - 2.2} ${cy - 0.4} A 2.3 2.3 0 0 1 ${cx + 0.6} ${cy - 2.2}`} stroke={hi} strokeWidth="0.9" fill="none" strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Vac, the robot vacuum, from above. Front is up. One amber eye, a bumper, a lid,
 * and a side brush that spins faster while a run is on.
 */
export function Vac({ className, running = false, style, eyeOff = false }: { className?: string; running?: boolean; style?: CSSProperties; eyeOff?: boolean }) {
  return (
    <svg viewBox="-6 -6 112 112" className={className} style={style} aria-hidden="true">
      <circle cx="53" cy="55" r="48" fill="rgba(6,18,72,0.45)" />
      {/* side brush, under the body at the front left */}
      <g className={`brush-spin ${running ? 'fast' : ''}`}>
        <circle cx="18" cy="20" r="2.5" fill="#15171c" />
        {[0, 120, 240].map((a) => (
          <line key={a} x1="18" y1="20" x2={18 + 15 * Math.cos((a * Math.PI) / 180)} y2={20 + 15 * Math.sin((a * Math.PI) / 180)} stroke="#c7ccda" strokeWidth="1.4" strokeLinecap="round" />
        ))}
      </g>
      <circle cx="50" cy="50" r="48" fill="#1b1e25" />
      <circle cx="50" cy="50" r="44.5" fill="var(--color-vac)" />
      {/* bumper seam across the front */}
      <path d="M 9 38 A 44 44 0 0 1 91 38" stroke="#15171c" strokeWidth="2" fill="none" />
      <circle cx="50" cy="54" r="31" fill="var(--color-vac-lid)" />
      <circle cx="50" cy="54" r="31" fill="none" stroke="#454b59" strokeWidth="1" />
      <path d="M 26 40 A 30 30 0 0 1 60 25" stroke="rgba(255,255,255,0.14)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* the button */}
      <circle cx="50" cy="56" r="8" fill="#23262e" />
      <circle cx="50" cy="56" r="4.6" fill="none" stroke={eyeOff ? '#4b5060' : 'var(--color-eye)'} strokeWidth="1.6" />
      {/* the eye */}
      <rect x="41" y="12" width="18" height="6" rx="3" fill="#0f1116" />
      <rect x="44" y="13.5" width="12" height="3" rx="1.5" fill={eyeOff ? '#4b5060' : 'var(--color-eye)'} className={eyeOff ? '' : 'eye-pulse'} />
    </svg>
  );
}

/** The bin: a hole in the floor with no bottom. 0x…dEaD. */
export function BinHole({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="49" fill="#2a2d36" />
      <circle cx="50" cy="50" r="44" fill="#1b1d24" />
      <circle cx="50" cy="52" r="36" fill="#121318" />
      <circle cx="50" cy="54" r="26" fill="#0b0c10" />
      <circle cx="50" cy="56" r="15" fill="#050608" />
      <path d="M 14 40 A 38 38 0 0 1 50 12" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** The piggy bank, from the side, coin slot on top. Keep runs only. */
export function Piggy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 92" className={className} aria-hidden="true">
      <ellipse cx="62" cy="86" rx="44" ry="5" fill="rgba(6,18,72,0.4)" />
      <rect x="34" y="66" width="12" height="20" rx="4" fill="#e9779f" />
      <rect x="76" y="66" width="12" height="20" rx="4" fill="#e9779f" />
      <path d="M 44 22 L 50 6 L 60 20 Z" fill="#e9779f" />
      <ellipse cx="60" cy="48" rx="46" ry="32" fill="var(--color-fuel)" />
      <path d="M 26 34 A 40 28 0 0 1 70 18" stroke="rgba(255,255,255,0.45)" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="108" cy="50" rx="9" ry="11" fill="#e9779f" />
      <circle cx="106" cy="46" r="1.8" fill="#8f2552" />
      <circle cx="106" cy="54" r="1.8" fill="#8f2552" />
      <circle cx="88" cy="38" r="3" fill="#121a3a" />
      <rect x="50" y="17" width="22" height="4" rx="2" fill="#8f2552" />
      <path d="M 14 46 q -8 -4 -6 -12" stroke="#e9779f" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** A coin: ETH from a trade. */
export function Coin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <circle cx="10.6" cy="10.8" r="9" fill="#c98a00" />
      <circle cx="10" cy="10" r="9" fill="#ffd34d" />
      <path d="M 10 4 L 14 10 L 10 12.4 L 6 10 Z M 10 13.4 L 14 11 L 10 16 L 6 11 Z" fill="#c98a00" />
    </svg>
  );
}

/** Deterministic scatter so the floor looks the same on every load. */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const SHAPES: Array<[number, number]> = [
  [2, 4],
  [2, 2],
  [1, 4],
  [2, 3],
  [1, 2],
  [2, 6],
  [1, 1],
  [1, 3],
];
const COLORS: BrickColor[] = ['red', 'yellow', 'white', 'green', 'red', 'black', 'yellow', 'orange', 'white', 'red'];

export interface LooseBrick {
  x: number; // 0..1 across the floor
  y: number;
  w: number;
  h: number;
  color: BrickColor;
  rot: number;
  size: number; // rem per stud
}

/** Bricks dropped across a floor, kept clear of the given boxes (fractions of the floor). */
export function scatter(count: number, seed: number, avoid: Array<[number, number, number, number]> = [], sizeRem = 1.15): LooseBrick[] {
  const rnd = seeded(seed);
  const out: LooseBrick[] = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 60) {
    const x = 0.03 + rnd() * 0.94;
    const y = 0.04 + rnd() * 0.92;
    if (avoid.some(([ax, ay, aw, ah]) => x > ax && x < ax + aw && y > ay && y < ay + ah)) continue;
    if (out.some((b) => Math.hypot(b.x - x, (b.y - y) * 0.6) < 0.07)) continue;
    const [w, h] = SHAPES[Math.floor(rnd() * SHAPES.length)];
    out.push({ x, y, w, h, color: COLORS[Math.floor(rnd() * COLORS.length)], rot: Math.round(rnd() * 8) * 22.5 - 90, size: sizeRem * (0.8 + rnd() * 0.4) });
  }
  return out;
}
