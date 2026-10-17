# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Purpose

The Vacuum ($VAC) is a memecoin on Robinhood Chain (chain ID 4663, Pons Family v2) with an autonomous buyback-and-burn engine. Trading generates creator fees in ETH that accumulate in a Fee Escrow. When the escrow passes the claim threshold, a 24/7 bot claims the fees. On burn cycles it market-buys the token on the DEX (Pons curve before graduation, Uniswap v4 after) and sends it to `0x000000000000000000000000000000000000dEaD`. Cycles alternate: odd cycles burn (0.01 ETH), even cycles keep (0.02 ETH, fees go to the project wallet). See `useBurnEngine` and `bot/pons-burn-bot.ts`.

The public website is a read-only tracker and landing page. A hidden `/memex` route is the operator admin panel.

## Users

- **Primary:** crypto traders and memecoin buyers on Robinhood Chain deciding whether to buy, usually arriving from X/Telegram on a phone or desktop. Their job: verify the burn is real, copy the CA, buy.
- **Secondary:** existing holders checking that runs keep happening.
- **Operator:** the creator, using `/memex` to configure the engine.

## Positioning

The first viewport must prove the burn is real: the live total in the bin, the share of supply gone, and the primary Buy action sit in the first view. Lore supports the proof. Tone: deadpan, toy-sized, a little menacing.

## Lore & terminology (confirmed 2026-10-17, replaces Lava Pit, Black Void, the ghost train and Sherwood)

- Name and ticker: **The Vacuum ($VAC)**. Tagline: "Everything ends up in the bin."
- Story: a kid built a city out of $VAC bricks on the living-room floor and went to bed. That night a robot vacuum woke on its dock, blinked one amber eye, and ate a red 2x4. Its name is **Vac**, and Vac is the bot.
- Fee Escrow → **the charge** (the ring around Vac's dock); claim threshold → **full charge**; buyback → Vac **buys $VAC off the floor**; burn → **into the bin**; dead address → **the bin** (nobody empties it); cycles → **runs** (odd: bin run; even: **the piggy bank**, the project wallet); burn log → **the bin log**.
- Piggy-bank runs are shown openly, never hidden.
- Brick world is generic studded bricks. Never use the LEGO name, logo, minifigure shape or trade dress.

## Constraints

- Change UI and lore copy only. Never change backend, bot, hooks (`useBurnEngine`), web3 utils, contracts, thresholds, features, handlers, data flow, or tokenomics.
- Existing tokenomics claims ("0% TAX", "LP LOCKED", "100% BURN", "Zero team allocation") belong to the user. "100% BURN" contradicts the keep cycles; the user was asked on 2026-10-07 and chose to keep the line as is. Do not raise it again or rewrite it unasked.
- Persisted data keys (`burnedJollyburn`, `burnedMuseburn`, `burnedIncinerator`, `jollyburn_*` storage keys) must stay readable.
- `?demo` on the dev server fills the bin log with synthetic runs for previews; it never ships in a production build.

## Open decisions

- Domain and X account for The Vacuum (none yet).
- Final CA: $VAC needs a new Pons launch; the on-chain name and ticker of an existing token cannot change.
- X content kit (konten-x/) still holds the Lava Pit kit.
