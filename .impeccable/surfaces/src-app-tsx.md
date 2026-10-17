---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface: public landing + live burn tracker (src/App.tsx)

Mode: Persuade. Visitors arrive from X/Telegram (phone first), want to verify the burn is real, copy the CA, and buy. Brand: The Vacuum ($VAC). Lore: a kid built a city of $VAC bricks on the living-room floor; at night a little robot vacuum, Vac, wakes on its dock and eats them. Every trade charges the dock; at full charge Vac does a run. Odd runs: buy $VAC and drop it in the bin (0x…dEaD, never emptied). Even runs: the change goes in the piggy bank (project wallet), shown openly. Tone: deadpan, toy-sized, a little menacing.

Constraints: UI and lore only. useBurnEngine, web3 utils, contracts, bot, /memex logic, thresholds and data flow stay untouched. Persisted ledger keys stay readable. Nothing of Lava Pit, Black Void, the ghost train or Sherwood survives on the public page. No LEGO name, logo, minifig or trade dress: generic studded bricks only.

Unattended run (user away): direction round not served; brief-pinned metaphor (vacuum + brick toy) plus the dealt form (candidate 5) built code-led, no image generation available.

## Direction contract
THESIS: The page is a brick-sorting tray seen from above, and Vac, a robot vacuum, works it. As you scroll, Vac rolls through the compartments and sucks the bricks out; emptied compartments are tagged with the run that cleared them. Refuses the dark crypto hero with counter, CA box and stat cards, and refuses the literal living-room cartoon.
OWN-WORLD: Cobalt molded plastic tray with deep wells, lit lip highlights and soft inner shadows. Bricks in primary red, yellow, green, white and black, drawn top-down as exact geometry with studs. Vac: charcoal disc, one amber eye. White parts-label stickers carry copy. Yellow 1xN brick buttons with studs. Piggy-bank pink only for keep runs. Heavy grotesque display, plain sans body, mono for numbers.
STORY: The visitor reads the live total of $VAC in the bin and the share of supply, copies the CA and buys, watches the dock charge, follows one run (charge, undock, sweep, bin or piggy bank), reads every burn as an emptied compartment with its tx, checks what Vac is doing now, reads how Vac got here, and ends watching the whole floor get sucked into the bin.
FIRST VIEWPORT: Full-bleed tray well, bricks scattered across it. Left: a white parts label (slight tilt) with THE VACUUM huge, the live burned total and % of supply, one line of lore, CA field and the yellow BUY $VAC brick button. Right: Vac on its dock, charge ring = escrow fill, next run named. Phone: label first, BUY above the fold, Vac below.
FORM: Brick parts-sorting tray worked by a robot vacuum, position 5 on the ordered list, seed: none (unavailable). Signature interaction: scroll-scrubbed sweep where Vac travels the hero and each brick it passes is sucked in; pinned run sequence; horizontal floor pan for the story; finale vortex pulling every brick into the bin. Raises: absence tagged as a record (VHS wall), run numbers stamped as stages (brine calendar), the wordmark behaving as matter in the finale (alphabet storm).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
