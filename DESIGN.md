---
name: The Vacuum
description: A cobalt brick-sorting tray seen from above, worked by Vac, a robot vacuum with one amber eye.
colors:
  well-floor: "#1b3fb4"
  well-deep: "#16359c"
  tray-lip: "#2552d8"
  lip-edge: "#4470ea"
  star: "#f4f6ff"
  star-dim: "#cdd6f7"
  label-paper: "#f6f7fb"
  label-shade: "#e3e7f3"
  label-rule: "#c9d1ea"
  pen: "#121a3a"
  pen-soft: "#4b5478"
  marker-red: "#d81e28"
  marker-deep: "#9c0f17"
  brick-yellow: "#ffc21a"
  brick-yellow-hot: "#ffe27a"
  brick-yellow-edge: "#c98a00"
  piggy-pink: "#ff9cc4"
  piggy-ink: "#a8255c"
  vac-charcoal: "#262a33"
  vac-lid: "#353a46"
  vac-eye: "#ffb020"
  brick-red: "#e3262f"
  brick-green: "#1f9d55"
  brick-white: "#eef0f6"
  brick-black: "#2a2d36"
  brick-orange: "#ff7a1a"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(4.2rem, 10vw, 7.6rem)"
    fontWeight: 800
    lineHeight: 0.82
    letterSpacing: "-0.03em"
    fontVariation: "\"wdth\" 75"
  headline:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 5.4vw, 4.8rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 75"
  title:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(1.7rem, 2.6vw, 2.4rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 75"
  body:
    fontFamily: "Figtree Variable, system-ui, sans-serif"
    fontSize: "1.08rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Figtree Variable, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 700
    letterSpacing: "0.01em"
  number:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
    fontFeature: "\"tnum\", \"lnum\""
rounded:
  pip: "4px"
  chip: "8px"
  brick: "10px"
  field: "12px"
  label: "14px"
  cell: "18px"
  well: "28px"
spacing:
  lip: "8px"
  lip-wide: "12px"
  inset-sm: "16px"
  inset-md: "32px"
  inset-lg: "48px"
  section-top: "64px"
  section-top-lg: "96px"
components:
  button-brick-yellow:
    backgroundColor: "{colors.brick-yellow}"
    textColor: "{colors.pen}"
    rounded: "{rounded.brick}"
    padding: "14px 24px"
  button-brick-yellow-hover:
    backgroundColor: "{colors.brick-yellow-hot}"
  button-brick-white:
    backgroundColor: "{colors.label-paper}"
    textColor: "{colors.pen}"
    rounded: "{rounded.brick}"
    padding: "12px 20px"
  button-brick-dark:
    backgroundColor: "{colors.brick-black}"
    textColor: "{colors.label-paper}"
    rounded: "{rounded.brick}"
    padding: "12px 16px"
  button-ghost:
    textColor: "{colors.star}"
    rounded: "{rounded.brick}"
  button-pen:
    textColor: "{colors.pen}"
    rounded: "{rounded.brick}"
  button-pen-hover:
    backgroundColor: "{colors.pen}"
    textColor: "{colors.label-paper}"
  well:
    backgroundColor: "{colors.well-floor}"
    textColor: "{colors.star}"
    rounded: "{rounded.well}"
  cell:
    backgroundColor: "{colors.well-deep}"
    textColor: "{colors.star}"
    rounded: "{rounded.cell}"
    padding: "24px"
  parts-label:
    backgroundColor: "{colors.label-paper}"
    textColor: "{colors.pen}"
    rounded: "{rounded.label}"
    padding: "32px 36px"
  ca-field:
    backgroundColor: "{colors.label-shade}"
    textColor: "{colors.pen}"
    rounded: "{rounded.field}"
    padding: "8px 8px 8px 16px"
  run-tag:
    backgroundColor: "{colors.label-paper}"
    textColor: "{colors.pen}"
    typography: "{typography.label}"
    rounded: "{rounded.label}"
    padding: "6px 12px"
---

# Design System: The Vacuum

## Overview

**Creative North Star: "The Sorting Tray"**

The page is a cobalt plastic brick-sorting tray seen from directly above. Every section is a molded well pressed into the tray, and the bright tray lip shows between wells as a thin ridge. Studded bricks in primary red, yellow, green, white and black lie scattered on the well floors, drawn top-down as exact geometry. Copy that matters never sits loose on the plastic: it goes on white parts-label stickers, slightly tilted, pressed on by hand. Vac, a charcoal disc with one amber eye, is the only character, and it works the tray: it sweeps the hero, runs the pinned sequence, and in the finale pulls every brick into the bin.

The world is toy-sized, deadpan and a little menacing. Material is literal: wells have a dark crease at the top edge and inner shade falling down the wall; bricks have a darker underside edge and round studs; stickers cast a soft drop shadow onto the plastic. Density is low, one idea per well, with big heavy condensed display type, plain sans body, and mono for every number and address.

The world rejects the dark crypto hero with counter, CA box and stat cards, and it rejects a literal living-room cartoon. The bricks are generic studded bricks, never a branded toy's name, logo, minifigure or trade dress.

**Key Characteristics:**
- Cobalt molded plastic as the only ground: wells on a lit lip, no flat page background.
- Primary-color studded bricks drawn top-down; the yellow brick is the action and the live reading.
- White parts-label stickers carry the copy that must be read, tilted a degree or two.
- Vac (charcoal, one amber eye) is the sole character and the motion engine.
- Piggy-bank pink appears only for keep runs.
- Heavy condensed grotesque display, plain sans body, mono numerals.

## Colors

Saturated cobalt plastic carrying primary-color bricks, white stickers and one pink exception.

### Primary
- **Yellow Brick** (brick-yellow): the primary action (every buy button), live readings on the plastic (run counts, the ticker beside amounts, the active run pip, the dock status while running), focus rings, text selection, the scrollbar thumb. Its hot tint (brick-yellow-hot) is hover only; its shaded edge (brick-yellow-edge) is the brick's underside.

### Secondary
- **Marker Red** (marker-red): the live burned total on the hero label, the "on a run" state on the status label, and counters inside white bricks. Red writes on paper, not on plastic. Marker Deep is its pressed shade.

### Tertiary
- **Piggy-Bank Pink** (piggy-pink): keep runs and nothing else: the piggy bank, its heading, its tx links, the "next run: the piggy bank" reading. Piggy Ink is its dark form for text on light ground.

### Neutral
- **Well Floor Cobalt** (well-floor): the floor of every section well.
- **Deep Well Cobalt** (well-deep): sub-compartments (cells), the finale well, the scrollbar track.
- **Tray Lip Cobalt** (tray-lip): the page ground, the ridges between wells, the scrolled nav.
- **Lit Lip Edge** (lip-edge): the light catching the lip's edge.
- **Star White** (star) and **Star Dim** (star-dim): primary and secondary text on plastic.
- **Label Paper** (label-paper), **Label Shade** (label-shade), **Label Rule** (label-rule): the sticker, a field pressed into it, and its dashed rules.
- **Pen** (pen) and **Pen Soft** (pen-soft): text on stickers and white bricks.
- **Vac Charcoal**, **Vac Lid**, **Vac Eye**: reserved for Vac and its dock. The amber eye is Vac's alone.
- **Brick colors** (brick-red, brick-green, brick-white, brick-black, brick-orange, plus brick-yellow): scattered parts only. Each brick has a face, a darker shaded edge and a light stud highlight.

### Named Rules
**The Pink Is Only For Keeps Rule.** Piggy-bank pink marks keep runs and nothing else. It never decorates, never marks a bin run, never becomes a second accent.

**The Yellow Is The Brick You Press Rule.** Yellow on plastic means either "press this" or "this is live". A static decoration is never yellow.

**The Red Writes On Paper Rule.** Marker red is for numbers and states written on white labels and bricks; on cobalt plastic, live values are yellow.

## Typography

**Display Font:** Bricolage Grotesque Variable at weight 800 and 75% width (with Arial Narrow)
**Body Font:** Figtree Variable (with system-ui)
**Label/Mono Font:** Figtree Variable 700 for labels; JetBrains Mono for numbers, addresses, hashes and times

**Character:** Box lettering: the condensed heavy grotesque reads like the print on a toy carton, set tight and stacked. Figtree is plain and friendly underneath it, and mono keeps every figure honest.

### Hierarchy
- **Display** (800, condensed, clamp 4.2-7.6rem, 0.82 leading): the wordmark on the hero label and the finale line. Tightest leading in the system.
- **Headline** (800, condensed, clamp 2.6-4.8rem, 0.9 leading): one per section well, on plastic in star white.
- **Title** (800, condensed, clamp 1.7-2.4rem up to 3.4rem for story chapters, 0.9 leading): run stage names (in yellow), story chapter titles, the status label's state, the lead run's amount.
- **Body** (400, ~1.08rem, relaxed leading): lore and explanation, held to 34-56ch.
- **Label** (Figtree 700, 0.78-1.05rem, lowercase sentence fragments): field names, counters, the dock status, run tags.
- **Number** (JetBrains Mono, tabular lining figures, 0.82-1rem): ETH amounts, addresses, tx hashes, timestamps, percentages. Big live totals use Display or Headline with tabular figures instead.
- **Vac's voice** (Bricolage 600, ~1.05rem, 1.1 leading): Vac's one-line quips only.

### Named Rules
**The Box Lettering Rule.** Display type is always Bricolage 800 at 75% width with negative tracking; never set it at normal width or a lighter weight.

**The Lowercase Labels Rule.** Labels and button copy are lowercase sentence fragments ("buy $VAC", "feed vac a brick", "open the full log"). No uppercase tracking, no eyebrow above a headline.

## Layout

The page is a stack of full-width wells pressed into the tray lip. Each section sits in its own well, inset by a thin lip gutter (8px, 12px from sm up) on the sides and between wells; no page background shows beyond that ridge. Inside a well, horizontal inset steps 16px / 32px / 48px across phone, sm and lg; section wells open with 64px top padding (96px at lg) and set their headline top-left.

Scroll is staged: the hero well fills the viewport under the fixed nav (100svh less the nav) and pins while Vac sweeps it; the run sequence pins in a viewport-high well; the story pans horizontally through chapter cells on lg; the finale is a tall scroll runway (about 280svh) with a sticky deep well. All pinned and scrubbed behavior is gated by reduced motion and falls back to a static stacked layout.

Grids inside wells are sub-compartments: the bin log is a 1/2/4-column grid of cells with the lead run taking a 2x2 cell; hero and status split into two columns at lg (label left, Vac right) and stack on phone with the label first and the buy brick above the fold.

## Elevation & Depth

Depth is physical and runs in two directions: things pressed into the tray (wells, cells, fields) are shaded inset, and things lying on it (stickers, bricks, Vac) cast soft drop shadows onto the plastic. All shadow color is a deep navy (rgba(6,18,72,...)), never black or grey.

### Shadow Vocabulary
- **Well wall** (`box-shadow: 0 -1px 0 rgba(6,18,72,.45), 0 1.5px 0 rgba(255,255,255,.28), inset 0 0 0 1px rgba(6,18,72,.35), inset 0 3px 0 rgba(6,18,72,.4), inset 0 22px 30px -8px rgba(6,18,72,.62), inset 0 -16px 26px -12px rgba(120,150,255,.16)`): every section well. Dark crease at the top edge, wall shade falling inward, faint bounce off the far wall.
- **Cell wall** (`box-shadow: 0 1px 0 rgba(255,255,255,.2), inset 0 0 0 1px rgba(6,18,72,.4), inset 0 2px 0 rgba(6,18,72,.45), inset 0 14px 20px -6px rgba(6,18,72,.55), inset 0 -10px 18px -10px rgba(120,150,255,.14)`): sub-compartments inside a well.
- **Sticker** (`box-shadow: 0 1px 0 rgba(255,255,255,.9) inset, 0 14px 30px -8px rgba(6,18,72,.55), 0 3px 6px rgba(6,18,72,.25)`): parts labels and run tags lying on the plastic.
- **Brick underside** (`box-shadow: inset 0 -5px 0 #c98a00, inset 0 2px 0 rgba(255,255,255,.55), 0 8px 16px -6px rgba(6,18,72,.6)`): the yellow brick button. White and dark bricks use a 4px underside in their own edge shade. This is the same shaded edge the top-down SVG bricks carry. Pressing collapses the underside to 2px and drops the brick 3px.

### Named Rules
**The Pressed In Or Lying On Rule.** Every surface is either molded into the tray (inset shade) or resting on it (navy drop shadow). Nothing floats with a generic card shadow.

**The Navy Shadow Rule.** Shadows are tinted rgba(6,18,72,...). Black shadows break the plastic.

## Shapes

Soft molded corners scale with depth: wells 28px, cells 18px, stickers 14px, fields 12px, bricks 10px, chips 8px, pips 4px. Brick buttons wear a row of round studs along the top edge, the same studs the scattered SVG bricks show from above. Stickers and run tags are rotated a few degrees (-4deg to +3deg), never more. A gap left by an emptied brick is the dashed outline of that brick and its studs. Vac, the bin and the dock are circles; everything else is a rounded rectangle.

## Components

### Buttons
Bricks you press: studded, chunky, with a shaded underside.
- **Shape:** gently rounded brick (10px) with a row of studs along the top edge.
- **Primary (yellow brick):** brick-yellow face, pen text, Figtree 800, trailing arrow icon; 14px 24px in the hero, larger in the finale.
- **Hover / Focus / Active:** hover lifts 2px and brightens to the hot yellow (studs follow); active drops 3px and the underside collapses; focus is a 3px yellow outline at 3px offset. Transitions run 0.14s on the expo-out curve.
- **White brick:** label-paper face, pen text, 4px grey-blue underside, white studs. Secondary actions on plastic (copy, open the log, feed Vac, sound toggle).
- **Dark brick:** brick-black face, paper text, near-black underside. Secondary actions on a white label (chart, log, copy CA in the finale).
- **Ghost:** translucent white with a 2px inner ring; minor icon actions on plastic.
- **Pen outline:** 2px pen ring that fills pen on hover; actions inside the drawer.

### Chips
- **Run tag:** a small parts-label sticker ("run 4") tilted -4deg or +3deg, stamped onto its compartment with an overshoot when it scrolls into view.
- **Reading chip:** a navy-tinted pressed pill (10px) holding a label and a mono value inside a run stage.

### Cards / Containers
- **Well:** well-floor cobalt, 28px, well-wall shadow; one per section.
- **Cell:** deep cobalt, 18px, cell-wall shadow, 20-24px padding; compartments for bin runs, story chapters and the run stage.
- **Parts label:** label-paper sticker, 14px, sticker shadow, pen text, tilted about -1.2deg on the hero and +0.8deg on the status well. Copy that must be read and copied lives here.

### Inputs / Fields
- **CA field:** a label-shade pressed panel (12px) inside the sticker: a label line above a truncated mono address, and a pen-colored copy chip (8px) on the right that swaps to "copied" with a check. Before launch it is a dashed label-rule outline holding one plain sentence.

### Navigation
- Fixed top bar, transparent over the hero, gaining tray-lip cobalt with a navy shadow once the page scrolls. Vac mark (spins 200deg on hover) plus "The Vacuum" in display type; lowercase section links in Figtree 600 that turn yellow on hover; a white-brick sound toggle and a yellow buy brick on the right. Links hide below md; the nav buy brick hides below sm because the hero carries it.

### Vac
A charcoal disc seen from above: bumper seam at the front, lighter lid, a pulsing amber eye bar, and a side brush that spins (fast while a run is on). The eye goes grey when the contract is unset (Vac asleep). The dock's charge ring shows escrow fill.

### Bricks and gaps
Top-down SVG bricks at 10 units per stud: navy cast shadow, shaded edge to the bottom-right, face, studs with a highlight arc. Rotations snap to 22.5deg steps, and the scatter is seeded so the floor is identical on every load. An emptied compartment shows the dashed outline of the brick that left.

## Do's and Don'ts

### Do:
- **Do** put every section in a well on the tray lip, with the 8px/12px lip showing between wells.
- **Do** make the primary action a yellow studded brick with a shaded underside that lifts on hover and drops on press.
- **Do** put copy that must be read or copied on a white parts-label sticker, tilted no more than a few degrees.
- **Do** set numbers, addresses, hashes and times in JetBrains Mono with tabular figures.
- **Do** tint every shadow navy (rgba(6,18,72,...)).
- **Do** gate pinned, scrubbed and looping motion behind prefers-reduced-motion with a static fallback.
- **Do** draw bricks top-down with exact studs, in the six brick colors only.

### Don't:
- **Don't** use piggy-bank pink for anything but keep runs.
- **Don't** use the LEGO name, logo, minifigure shape or trade dress; bricks are generic.
- **Don't** build the dark crypto hero with counter, CA box and stat cards, and don't draw a literal living-room cartoon.
- **Don't** give Vac's amber eye color to anything but Vac.
- **Don't** use black or grey shadows, or generic floating card shadows.
- **Don't** set display type at normal width or below weight 800.
- **Don't** put uppercase tracked eyebrows or kickers above headlines.
