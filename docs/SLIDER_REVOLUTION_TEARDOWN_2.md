# Slider Revolution — second teardown, from the screen recordings

Eighteen recordings of the sliderrevolution.com template previews, 2940×1764
at 60 fps, roughly nine minutes in total. This is what they actually do,
measured rather than guessed: every frame was decoded to a 64×36 greyscale
buffer and the mean absolute difference between consecutive frames gives a
motion curve. A burst in that curve is a transition; where its peak sits
inside the burst tells you the easing without opening a devtools panel.

**Reading the peak position.** A burst whose peak lands at 5 % of its duration
is front-loaded: everything moves at once and then decelerates — `ease-out`,
the thing arrives and settles. A peak at 70–80 % is back-loaded: the change
accumulates late, which is what a *staggered* group looks like, because the
last child is still travelling when the first has already stopped. A peak at
45–50 % is a symmetric `ease-in-out` on a single element.

## The templates

| # | Template | Form |
|---|---|---|
| v01 | oakgrove-wine-slider | Product hero, title behind the bottle |
| v02 | coffee-shop-split-screen-slider | 50/50 split, vertical swatch selector |
| v03 | shft-interior-design | Anchored title, dissolving backdrops, sticky process list |
| v04 | from-sketch-to-product-slider | Draw-on reveal |
| v05 | dj-website-with-scroll-video | Scroll-scrubbed video, title scales with scroll |
| v06 | wordpress-hero-image | Plain image hero |
| v07 | old-soul-tattoo-studio-slideshow | Full-bleed portrait slideshow, counter + dots + arrows |
| v08 / v09 | justice-row-law-firm-slider | Word-by-word title assembly, image expands from a small rect |
| v10 | dental-clinic-dentist | Photo mosaic + persistent side card |
| v11 | bento-grid-travel-slider | Bento grid, tiles cascade out and refill, palette retints |
| v12 | hair-salon-hairdresser | Section-to-section title swap, blur-through service slider |
| v13 | suits-product-showcase | Narrow colour panel that retints per slide, line-mask title exit |
| v14 | modern-web-agency | Metronomic 0.52 s transitions |
| v15 | food-presentation-slider | — |
| v16 | fitness-gym-website-slider | Video slides, ghost/solid two-line title, orange wipe edge |
| v17 | smart-living-one-pager-v3 | Anchored title, numbered backdrops, next-slide thumbnail |
| v18 | portal-effect-hero-slider | Portal/zoom-through |

## Measured timings

Every number below is from the motion curve, not from the marketing copy.

| Template | Transition | Peak at | Dwell | Reading |
|---|---|---|---|---|
| v07 tattoo | 0.67 – 0.70 s | 0.03 – 0.10 s | 2.0 – 2.5 s | front-loaded, one element |
| v14 agency | 0.50 – 0.52 s | 0.22 – 0.32 s | 3.0 – 4.2 s | near-symmetric |
| v10 dental | 1.02 – 1.05 s | 0.63 – 0.77 s | 1.4 – 2.4 s | staggered group |
| v13 suits | 0.90 – 1.08 s | 0.43 – 0.68 s | 4.4 – 5.5 s | symmetric, two layers |
| v17 property | 0.67 – 0.77 s | 0.13 – 0.50 s | 4.7 – 8.0 s | mixed |
| v18 portal | 0.53 – 0.77 s | 0.35 – 0.50 s | 2.9 – 4.4 s | symmetric |
| v01 wine | 0.57 s exit → 0.50 s hold → 0.88 s entrance | exit 0.05 s, entrance 0.58 s | ~1.7 s | see below |

**Three findings worth keeping.**

1. **Nobody transitions in 300 ms.** The whole corpus sits between 0.50 s and
   1.10 s, and the fast end is reserved for a single element moving. Our
   catalogue's 200–300 ms hero transitions read as cheap next to this, and
   that is most of the gap the user noticed on impact-37.

2. **The dwell is longer than the transition, always — usually 3× to 6×.**
   A slide that changes every 1.8 s feels like a slideshow screensaver. These
   sit at 2.5 s to 5 s of stillness between moves.

3. **v01 is a three-part transition, not one.** The outgoing bottle leaves over
   0.57 s front-loaded, then **half a second of nothing**, then the new one
   arrives over 0.88 s with its peak at 0.58 s. That deliberate empty beat is
   what makes it feel expensive. Everything in our catalogue cross-fades:
   out and in overlap, so there is never a moment of held emptiness.

## The devices, one by one

### Title anchored, backdrop changing (v03, v17)

The headline never moves. Only the photograph behind it dissolves, on a slow
beat, and a small index (`01 / 02 / 03`) ticks over with it. v03 layers a
walking figure into the shots so the dissolve reads as motion blur rather than
a crossfade. This is exactly the direction asked for on the Hub hero, and the
corpus confirms it is what the expensive templates do.

### Title behind the product (v01)

The wordmark is set in a wide-tracked serif — roughly `0.35em` — centred, and
the bottle is drawn *over* its middle letters. Two DOM layers, one z-index
apart, and the hero immediately has depth. A hairline arch outline sits behind
the product, and a circular badge with text on a circular path rotates slowly
at the top right.

### Word-by-word assembly (v08)

Each word of the headline is its own element, entering from a small vertical
offset, staggered roughly 40–60 ms apart. Mid-flight frames show `to` and
`your` at different heights on the same line. The image behind starts as a
small rounded rectangle and expands to full bleed over the same window — which
is why the burst peaks at 0.75 s: the last word and the last few pixels of the
image land together.

### Line-mask exit (v13)

Each line of the title slides out horizontally inside its own clipping mask,
so you briefly read `egance` and `zation` — the tails of two lines leaving at
different speeds. Cheap to build (`overflow: hidden` on a per-line wrapper),
and far more legible than a fade.

### Ghost + solid two-line title (v16)

Line one is outlined or set at low opacity; line two is solid in the accent
colour. Same face, same size, two weights of presence. It reads as a designed
lockup rather than a headline, and it costs one extra span.

### Panel that retints per slide (v13, v11)

A solid colour block — a narrow left column in v13, the text tiles in v11 —
takes a colour sampled from the current photograph. The layout never changes;
the whole page still feels like it changed. This is the single highest
ratio of perceived effort to actual work in the entire corpus.

### Bento cascade (v11)

Seven tiles of unequal size fill the viewport. On transition they empty in a
staggered cascade and refill in the same order, so mid-transition frames are
mostly black. The stagger is what makes the 0.9 s feel like one gesture rather
than seven.

### Split screen with the selector on the seam (v02)

Photo left, cream panel right, and the slide selector is a vertical column of
round swatches sitting exactly on the divider — each swatch tinted with the
colour of the drink it selects. The counter is a stacked fraction with a
diagonal rule. Vertical arrows, bottom right, because the slider moves
vertically.

### Blur-through label change (v12)

The service name does not fade, it blurs out and the next one blurs in. One
frame catches `ENHANCE` half-dissolved and clearly gaussian-blurred. Costs a
`filter: blur()` on the exit and buys a much more physical feeling than opacity.

## What this changes for us

- Lengthen every hero transition to the 0.6 – 1.0 s band, and lengthen the
  dwell more than that.
- Stagger the children of any group so the burst peaks late; a group that
  moves as one block reads as a single flat element.
- Insert a held empty beat between exit and entrance on product heroes.
- Prefer masked line slides and blur-through over opacity fades.
- Retint one flat surface per slide instead of rebuilding the layout.
