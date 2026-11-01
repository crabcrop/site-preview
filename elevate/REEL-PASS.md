# Reel pass: what changed and why

Previews of crabcrop.org (index.html, docs.html) after one pass with the three
skills named in the reel "3 Claude Skills That Make Your Websites Look Like a
Pro Designed Them". Nothing here is published; the live site is untouched.
Every factual line of copy is unchanged. The only new visible words are the
hero frame's two operation chips (crop:1200x630:smart, format(avif)) and its
caption.

## Motion (Emil Kowalski: emil-design-eng, animate)

- New tokens --ease-out cubic-bezier(0.23, 1, 0.32, 1) and --ease-in-out
  cubic-bezier(0.77, 0, 0.175, 1), from the skills' tables. Interface hovers
  and entrances now use the strong ease-out instead of the overshoot --snap
  curve, which stays only on the mascot's own snap and happy animations
  (the skills reserve bounce for playful components).
- transition: all removed everywhere it appeared (feature chips, demo chips,
  code tabs). Transitions now name their properties.
- Buttons and pressable chips gained the press response the skills require:
  transform scale(0.97) on :active. Buttons previously reset to
  translateX(0) on press, which read as no feedback at all.
- Every hover that moves an element (buttons, cards, chips, part rows) is
  gated behind @media (hover: hover) and (pointer: fine), so touch taps no
  longer trigger false hover motion.
- Section entrances added where the page previously had none: heading, then
  text, then media, rising 22px with opacity, staggered 70 to 180ms,
  triggered once. Content is hidden only when JavaScript runs (the html.js
  gate), so a script failure can never blank the page, and reduced motion
  shows everything at rest. Docs sections stay still, for reading stability;
  only the docs header and nav fade in.
- The before/after sliders keep their exact mechanics (direct manipulation,
  a vertical divider tracking the pointer). The handle now grows slightly
  while dragged, and the slider shows a visible focus ring for keyboard
  users, which it previously lacked.

## Layout, type, surfaces (Impeccable)

- Browser surfaces themed from the palette (craft floor): coral text
  selection, sun-yellow focus-visible rings, 3px underline offset,
  font smoothing, thin brand-tinted scrollbars on the feature strip and
  the docs nav.
- Headings get text-wrap: balance.
- Docs prose measure narrowed from 760px to 68ch, inside the 65 to 75
  character band the typeset guidance sets. Docs section padding widened.
- Docs nav gained a scrollspy: the section being read is highlighted.
  Reference tables gained a subtle row hover for scanning.
- Homepage section padding widened from 56px to 76px on desktop
  (56px kept on phones), so the gap between sections is clearly larger
  than any gap inside one.

## Art direction (Taste, design-taste-frontend)

- The first screen had no image. The hero is again a two-column composition
  with the mascot as a framed print on the right, in the site's own
  frame-and-notes language, its notes naming real operations. One dominant
  real picture of the subject's world, per the imagery laws. The animation
  and mechanics of the existing demos were not touched.
- Applied under the skill's existing-brand clause: palette and type kept,
  composition and craft taken. The house rules that conflict with this
  site's established identity were kept as brand, deliberately: monospace
  operation labels (the product's grammar made visible), hard offset
  shadows, the dotted paper texture, the cream and coral palette, and the
  coral second clause in headlines. The lint findings for those classes
  are identical before and after, by decision, not by oversight.

## Evidence

- Taste lint, before: 176 FAIL, 21 WARN. After: 176 FAIL, 15 WARN.
  The only delta is transition-all, 6 warnings to 0. Remaining FAILs by
  class: mono 92, shadow 67, gradient 10, hairline 5 (inside real tables),
  emoji 2 (the footer signoff crab). All pre-existing brand devices.
- Copy diff (visible words): docs.html identical; index.html differs only
  by the hero caption and chips listed above. No words removed.
- HTML tag balance clean on both files; no element id added or removed, so
  every demo (URL builder pieces, tabs, sliders, builders) keeps its wiring;
  all inline scripts pass a Node syntax check.
- File sizes: index.html 70,291 to 73,526 bytes (+4.6 percent);
  docs.html 168,630 to 171,935 bytes (+2.0 percent).
- Not verified: rendered screenshots. This environment has no usable
  browser binary (the only Chromium is policy-locked), so the Taste
  inspector could not run and no pixel check was possible. Open both
  previews in a browser before judging the hero composition and the
  entrance timing; those are the two changes a screenshot would settle.
