# Logo rollout — batch D (impact-43 to impact-99)

Report format: `- impact-NN/page.tsx | fait — <note>` or `- impact-NN/page.tsx | skippé — <reason>`

**Systemic finding**: unlike impact-219 (single-file template, nav lives inline in `page.tsx`), most templates in this range (43-99) are multi-page templates where the persistent nav/header lives in `app/templates/impact-NN/layout.tsx`, not in `page.tsx`. `page.tsx` in those cases only renders the home-page sections (hero, about, pricing, etc.) with no header markup at all. Per task scope ("the file is `app/templates/impact-NN/page.tsx`"), these are logged as skipped — editing `page.tsx` would have no effect on the rendered nav. **All of these `layout.tsx` navs were checked and are 100% hardcoded (zero `fd`/`businessName`/`logoBase64` references)** — none of them show the client's business at all today, not even as text. Fixing the actual logo requirement for this whole family requires a follow-up pass on `layout.tsx`, not `page.tsx`.

- impact-43/page.tsx | skippé — no nav/header in page.tsx; nav lives in layout.tsx (hardcoded "Serene Retreat" wordmark, no fd refs at all) — out of scope for this batch (page.tsx only)
- impact-44/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-45/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-46/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-47/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-48/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-49/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-50/page.tsx | fait — nav in page.tsx showed hardcoded "Laurence Moreau / Psychologue clinicienne" wordmark; wrapped in logoBase64 conditional
- impact-51/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-52/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-53/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-54/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-55/page.tsx | fait — nav in page.tsx showed hardcoded "Maître Renard / & Associés" wordmark; wrapped in logoBase64 conditional
- impact-56/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-57/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-58/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup (only fixed-position element in page.tsx is a showreel modal, unrelated)
- impact-59/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-60/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-61/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-62/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-63/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-64/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-65/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-66/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-67/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-68/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-69/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-70/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-71/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-72/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-73/page.tsx | fait — nav in page.tsx showed icon (Music) + hardcoded "Conservatoire Accord" wordmark; wrapped in logoBase64 conditional
- impact-74/page.tsx | fait — nav in page.tsx read fd?.businessName directly; wrapped in logoBase64 conditional
- impact-75/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-76/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-77/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-78/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-79/page.tsx | fait — nav Link showed hardcoded "Artisanal. / BOULANGERIE.NOIRE" wordmark; wrapped in logoBase64 conditional
- impact-80/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-81/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup (only businessName mention in page.tsx is hero image alt text, not nav)
- impact-82/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup (only businessName mention in page.tsx is hero image alt text, not nav)
- impact-83/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup
- impact-84/page.tsx | skippé — same as impact-43: nav is in layout.tsx, page.tsx has no header markup (only businessName mention in page.tsx is hero image alt text, not nav)
- impact-85/page.tsx | fait — nav Link + mobile drawer header both read fd?.businessName as text; wrapped both occurrences in logoBase64 conditional
- impact-86/page.tsx | fait — nav Link (icon+businessName) + mobile drawer header both personalized text; wrapped both occurrences in logoBase64 conditional
- impact-87/page.tsx | fait — nav in page.tsx (not layout.tsx, unlike most of this batch) showed hardcoded "IRON CLUB" wordmark; wrapped in logoBase64 conditional
- impact-88/page.tsx | fait — nav Link showed icon + hardcoded "VELVET / Nails" wordmark; wrapped in logoBase64 conditional (left the footer's separate fd?.businessName-driven brand mark untouched, per instructions)
- impact-89/page.tsx | fait — nav Link showed badge-icon + hardcoded "INK & IRON" wordmark; wrapped in logoBase64 conditional
- impact-90/page.tsx | fait — nav showed wheat SVG mark + fd?.businessName text; wrapped in logoBase64 conditional
- impact-91/page.tsx | fait — nav lives in a standalone Nav() function component within page.tsx (same module-scope fd pattern as rest of file); showed hardcoded "AURELIA" wordmark; wrapped in logoBase64 conditional
- impact-92/page.tsx | fait — nav Link showed icon (Building2 badge) + hardcoded "Skyline / Concierge Group" wordmark; wrapped in logoBase64 conditional
- impact-93/page.tsx | fait — nav Link showed icon (Plane) + hardcoded "Velocity / Jet Charter" wordmark; wrapped in logoBase64 conditional
- impact-94/page.tsx | fait — nav Link showed icon (Flower) + hardcoded "Botanica" wordmark; wrapped in logoBase64 conditional
- impact-95/page.tsx | fait — nav button + mobile drawer header both read fd?.businessName as text; wrapped both occurrences in logoBase64 conditional
- impact-96/page.tsx | fait — nav Link showed film-gate icon + fd?.businessName text + tagline; wrapped in logoBase64 conditional
- impact-97/page.tsx | fait — nav Link showed icon (Compass badge) + hardcoded "Horizon / Maritime Group" wordmark; wrapped in logoBase64 conditional
- impact-98/page.tsx | fait — nav Link showed hardcoded "Zenith / Swiss Horology" wordmark (no icon); wrapped in logoBase64 conditional
- impact-99/page.tsx | fait — nav button (SPA-style page switcher, no href) showed hardcoded "Ember / Grill & Cellar" wordmark; wrapped in logoBase64 conditional

## Summary
57/57 files processed. 20 edited (fait): 50, 55, 73, 74, 79, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99.
37 skipped (all for the same structural reason — see "Systemic finding" above): 43, 44, 45, 46, 47, 48, 49, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 75, 76, 77, 78, 80, 81, 82, 83, 84.

**Recommended follow-up**: a second pass on the 37 skipped templates' `layout.tsx` files (not `page.tsx`) is needed to actually satisfy the "client sees their logo in the nav" requirement for those — currently their nav is 100% static across every one of them.
