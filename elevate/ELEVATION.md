# Crabcrop homepage: visual elevation plan

Scope: presentation only. Content, copy, section order, structure, and imagery are frozen. Snap artwork stays exactly as it is, in the same slots and crops unless a framing value below says otherwise. No new sections, motifs, themes, fonts, or generated imagery. Round 1 changes in the reel pass (named transitions, press scale on buttons, gated moving hovers, section entrances, themed selection and focus, balanced headings, widened section padding) are the baseline and are not repeated here.

Drift note: Live copy and section order match the local mirror, but the mirror is an unpublished reel pass preview, so its hero frame treatment is not assumed to be live.

## Elevation thesis

The page already has a real identity: cream ground, coral action, ink text, hard offset shadows, shell radii, and monospace operation labels that show the product grammar. It does not need a new look. It needs the existing look set with more precision: a wider type scale, coral and tide values that pass contrast at the sizes where they are actually used, one spacing rhythm in steps of 8px, surfaces that share one border weight, and motion that answers the hand instead of looping on its own. Every change below is a value change inside the current system.

## Audit findings

Sources read: live homepage text fetch on 2026-10-31, the local mirror at website-reel-pass/index.html, and REEL-PASS.md.

Typography

- Display to body ratio is weak. H1 is clamp(42px, 6.4vw, 74px) against a 19px lede, a ratio of about 3.9, below the 4.3 median in design-taste-frontend / type.
- H1 leading is 1.02 and tracking is -0.03em. Both sit inside the display band, but at a larger size the leading can tighten.
- The lede inherits body leading 1.6 at 19px, which reads loose for a supporting line. Its measure, max-width 660px, is inside the 45 to 75 character band. Leave the measure alone.
- H3 at 19px and 800 weight sits almost on top of the 19px lede in size, separated by weight and color only. That is a later item.

Spacing

- Generic sections use padding 88px top and bottom, so two sections meet with up to 176px of combined padding. The features section then overrides its top padding inline to 26px, which breaks the rhythm the other sections set.
- The hero inherits the same 88px top padding under a sticky header, so the first screen starts looser than the sections below it.

Color, measured on the cream ground #FBF0D9

- Ink #142832 on cream: 13.46 to 1. Pass, leave alone.
- Secondary ink #47606E on cream: 5.86 to 1. Pass for body and lede text, leave alone.
- Coral #E8482F as headline text on cream: 3.44 to 1. It passes only as large text and has no margin at smaller heading sizes.
- White text on the coral button #E8482F: 3.89 to 1. The button label is 15px at 800 weight, which is not large text, so this pairing fails the 4.5 to 1 body floor.
- Tide #0E7C7B as the 12px tidemark label on cream: 4.43 to 1, just under the 4.5 to 1 floor.
- Sun #FFB020 as the focus outline on cream: 1.62 to 1. The focus state is the weakest contrast on the page.
- Coral deep #B92F1B already exists in the palette and performs better in every pairing above: 5.33 to 1 on cream, and white on it is 6.03 to 1.

Surfaces and borders

- Border weight is inconsistent for the same job: framed surfaces use 2px solid ink (hero frame, code window), while specimen cards use 1.5px and the install command strip uses no border and no shadow at all, although it is the same kind of object as the code window.
- The install command strip uses padding 12px 14px and 13px code, tighter and smaller than every other code surface on the page (code window: padding 26px, 14px code, line-height 1.75).
- Hard offset shadows, the shell radius (28px 28px 28px 6px), and the dotted paper texture are deliberate brand devices confirmed in round 1. Leave all three alone everywhere.

Image framing

- The hero frame is the one dominant image on the first screen, square, in a white frame with a caption and two operation notes. That composition is right. Its faults are mechanical, listed under motion, not compositional.

Motion, against the emil-design-eng contract

- Good, leave alone: no transition: all remains anywhere, no ease-in is used on interface elements, buttons already scale to 0.97 on :active over 160ms with the strong ease-out curve, and the global reduced motion rule sets entrances visible at rest.
- The hero frame runs an infinite alternate rotation animation (tide, 7s, rotate -2deg to -1deg) with no purpose a visitor can name, and .frame:hover stops it and straightens the frame. That hover rule is not gated behind a hover capable media query, so a touch tap can trigger it.
- Section entrances (.rv) pair opacity on a plain ease with transform on the strong ease-out curve, at 550ms and 600ms. Two curves on one entrance read as two events.
- The install Copy button has no transition and no :active state at all, while the primary button next to it in reading order has both. Same job, different feedback.

## Stage 1: hero and Install section

Thirteen items. Built together, these two regions should carry the whole elevation on their own: type scale, corrected accent values, spacing rhythm, one surface language, and the motion contract.

### Type

S1.1 H1 scale, leading, tracking

| Before | After |
| --- | --- |
| font-size clamp(42px, 6.4vw, 74px); line-height 1.02; letter-spacing -0.03em; weight 900 | font-size clamp(44px, 6.8vw, 80px); line-height 0.98; letter-spacing -0.035em; weight 900 |

Source: design-taste-frontend / type, display type wants tracking -0.02 to -0.05em and leading 0.85 to 1.05, and size contrast is the main lever, with a headline to body ratio of 4.3 or better on the strongest sites. At 80px against the 20px lede in S1.2, the ratio is 4.0 at the cap and the clamp keeps the two line headline inside two lines at 390px. impeccable / typeset adds that adjacent roles must differ by size as well as weight, which the wider gap to H2 in S1.3 completes.

S1.2 Lede setting

| Before | After |
| --- | --- |
| font-size 19px; line-height inherited 1.6; max-width 660px; color #47606E | font-size 20px; line-height 1.45; max-width 640px; color #47606E, unchanged |

Source: design-taste-frontend / type, the lead step is 20 to 26px with leading 1.3 to 1.4, loosened slightly here to 1.45 because this lede runs to five lines, and running text leading sits at 1.45 to 1.6. impeccable / craft-floor keeps the measure inside 65 to 75 characters at the widest; 640px at 20px holds that.

S1.3 H2 role, as seen in the Install heading

| Before | After |
| --- | --- |
| font-size clamp(30px, 4.2vw, 46px); line-height 1.08; letter-spacing -0.025em; margin-bottom 16px | font-size clamp(30px, 3.6vw, 40px); line-height 1.05; letter-spacing -0.025em, unchanged; margin-bottom 16px, unchanged |

Source: design-taste-frontend / type, five sizes is the ceiling and one size should stay dominant per screen; a 40px section heading against an 80px H1 restores that dominance, which the current 46px against 74px blurs. impeccable / typeset: repeated roles stay identical, so this value applies to every H2 on the page when later stages land, but it is proven here first.

### Color within the cream and coral family

S1.4 Coral used as text

| Before | After |
| --- | --- |
| Headline coral clause and other coral text: #E8482F on #FBF0D9, 3.44 to 1 | Coral text: #C93A22 on #FBF0D9, 4.52 to 1. Bright #E8482F stays only where it is already graphic, the claw strokes and the frame note fill |

Source: impeccable / craft-floor, body text at 4.5 to 1 or better and large text at 3 to 1 or better, checked at the size actually rendered. design-taste-frontend / colour: the accent marks the action and at most one other recurring thing, so the bright value is reserved and the text value does the reading work. The styled coral clause itself stays; only its value changes. This respects the round 1 brand decision recorded in REEL-PASS.md.

S1.5 Primary button fill

| Before | After |
| --- | --- |
| background #E8482F, white text 3.89 to 1; hover #B92F1B; padding 13px 24px | background #B92F1B, white text 6.03 to 1; hover #9E2817, white text 7.58 to 1; padding 14px 26px; min-height 48px |

Source: impeccable / craft-floor contrast floor, as in S1.4, plus design-taste-frontend / colour, hover states increase contrast, never reduce it. The deeper rest value is the current hover token promoted, so no new hue enters the palette. Radius, border, and shadow are unchanged.

S1.6 Tidemark and Install route links

| Before | After |
| --- | --- |
| Tidemark text and inline links: #0E7C7B on cream, 4.43 to 1; tidemark letter-spacing 0.18em at 12px | Text and link color #0B6363 on cream, 6.23 to 1; tidemark letter-spacing 0.16em at 12.5px |

Source: impeccable / craft-floor contrast floor for small text. design-taste-frontend / colour: if a quieter text is needed it is a defined role, not a new grey; #0B6363 is a step inside the existing tide family between #0E7C7B and #084F57, not a new color family. The tidemark device itself stays, per the round 1 brand decision; only its value and spacing are corrected.

### Spacing rhythm

S1.7 Hero spacing

| Before | After |
| --- | --- |
| Hero section padding 88px top and 88px bottom (inherited); hero grid gap 48px; call to action row margin 30px top, 20px bottom | Hero padding 64px top and 72px bottom; hero grid gap 56px; call to action row margin 32px top, 0px bottom |

Source: impeccable / layout, use a documented spacing scale built on a 4 unit base and create rhythm through deliberate contrast between tight and generous intervals; every value above is a multiple of 8. design-taste-frontend / layout: the gap between sections must be clearly larger than any gap inside one, and the first screen must not read as a hole under the navigation. 64px at the top tightens the first screen while the 72px below it, plus the Install top padding in S1.9, keeps the between section gap the largest interval on the screen.

S1.8 Hero frame and caption

| Before | After |
| --- | --- |
| Frame padding 10px; caption font-size 13.5px, padding 10px 4px 2px; operation notes padding 6px 11px at 12.5px | Frame padding 12px; caption font-size 14px, padding 12px 4px 2px; operation notes padding 7px 12px at 13px |

Source: impeccable / polish, fix optical as well as mathematical alignment and keep same role typography consistent; the caption and notes are the frame's metadata role, and 13.5px and 12.5px are two near identical sizes doing one job. design-taste-frontend / type: if two sizes look almost the same, make them the same family step; 14px and 13px keep the caption primary and the notes secondary without a third size. Border 2px, radius 6px, rotation -2deg, shadow, image, and crop are all unchanged.

### Install section surface

S1.9 Command strip as a code surface

| Before | After |
| --- | --- |
| .cmdstrip: background #0D202E; border none; box-shadow none; border-radius 10px; padding 12px 14px; margin-top 14px; code 13px, line-height normal | .cmdstrip: background #0D202E, unchanged; border 2px solid #142832; box-shadow 5px 5px 0 rgba(20,40,50,.14); border-radius 12px; padding 18px 20px; margin-top 16px; code 14px, line-height 1.6 |

Source: impeccable / polish, classify this as a one-off implementation and replace it with the shared pattern the system already owns, which is the code window (2px ink border, hard offset shadow, 14px code). impeccable / layout: group by meaning before adding decoration; matching the code window states plainly that this strip is code. The routes line below it moves from margin-top 14px to 18px so the strip and its alternatives read as one group, per the same proximity rule.

### Motion polish for Stage 1, under the Kowalski contract

S1.10 Remove the infinite frame animation

| Before | After |
| --- | --- |
| .frame animation tide 7s ease-in-out infinite alternate, rotate -2deg to -1deg; .frame:hover removes the animation and sets rotate 0deg, ungated | No animation on .frame; static transform rotate(-2deg); on hover capable pointers only, transition transform 240ms cubic-bezier(0.23, 1, 0.32, 1) and hover transform rotate(-1deg) |

Source: emil-design-eng, every animation needs a purpose the visitor can name, and frequent or constant motion with no purpose should be removed; the Animation Decision Framework puts hover and ambient effects at the top of the remove or reduce list. design-taste-frontend / motion lists infinite loops that mean nothing as a generated tell. The tilt itself is brand and stays; only the loop goes.

S1.11 One curve for the Stage 1 entrances

| Before | After |
| --- | --- |
| .rv transition: opacity 550ms ease, transform 600ms cubic-bezier(0.23, 1, 0.32, 1); delays 0, 70, 140, 180ms | .rv transition: opacity 480ms cubic-bezier(0.23, 1, 0.32, 1), transform 560ms cubic-bezier(0.23, 1, 0.32, 1); delays 0, 70, 140, 180ms, unchanged |

Source: emil-design-eng, use strong custom ease-out curves for entrances, specify exact properties, and keep stagger delays short at 30 to 80ms between items, which the existing delays already meet in reading order (heading, text, actions, frame). design-taste-frontend / motion: section entrances arrive in reading order, staggered, rising with opacity, once. Duration stays in the reveal band because these are once per visit entrances, not repeated interface moves. The html.js gate and the reduced motion rule are unchanged, so content is never hidden when script or motion is unavailable.

S1.12 Copy button feedback parity

| Before | After |
| --- | --- |
| .copybtn: no transition, no :active state; hover background change is instant | .copybtn: transition transform 160ms cubic-bezier(0.23, 1, 0.32, 1), background-color 160ms ease; :active transform scale(0.97) |

Source: emil-design-eng, buttons must feel responsive, with scale(0.97) on :active and a 100 to 160ms press duration, and this applies to any pressable element. The primary button already meets the contract at 160ms; this item brings the second pressable control in Stage 1 up to the same contract instead of inventing a new one. Hover color changes use plain ease, per the same framework's easing table for hover and color.

### Browser surfaces in the Stage 1 regions

S1.13 Selection and focus values

| Before | After |
| --- | --- |
| ::selection background #E8482F, white text 3.89 to 1; :focus-visible outline 3px solid #FFB020, offset 2px, 1.62 to 1 against cream | ::selection background #B92F1B, white text 6.03 to 1; :focus-visible on light grounds outline 3px solid #B92F1B, offset 3px; on dark grounds (command strip, code window) outline 3px solid #FFB020, which is 8.33 to 1 against ink #142832 |

Source: impeccable / craft-floor, browser surfaces are part of the design: text selection, focus rings, and underline offset ship with defaults that belong to no system, and theming them from the palette is the cheapest signal that a page was built rather than assembled. design-taste-frontend / type lists the same pair, a selection in the accent with its ink, and a visible focus-visible outline in the accent. The sun ring is not deleted; it is moved to the dark surfaces where it actually reads.

## Later stages: the rest of the page

Apply in this order. No item here changes structure, copy, or imagery.

L1 Header surface. Before: background rgba(251,240,217,.94) with backdrop-filter blur(10px). After: background #FBF0D9 solid, no backdrop filter, height and links unchanged. Source: design-taste-frontend house rules, no glass and no backdrop blur panels; a plain bar carries the wordmark, links, and one action. impeccable / polish: keep color meanings stable, and the solid value is the page ground itself.

L2 Section rhythm repair. Before: generic section padding 88px top and bottom, with the features section overriding top padding inline to 26px. After: remove the inline override; every content section uses 88px top and 88px bottom, with Stage 1 hero and Install values as the only named exceptions. Source: impeccable / layout, rhythm comes from a documented scale rather than one off values. design-taste-frontend / layout: the gap between sections is clearly larger than any gap inside one, counted the same way everywhere.

L3 Card body size. Before: specimen and strip card body text 15px, line-height 1.6, color #47606E. After: 16px, line-height 1.55, color unchanged. Source: impeccable / typeset, 16px is the ordinary web body floor unless a dense role justifies less, and no card role here is dense. impeccable / typeset also separates the H3 role from the lede: H3 stays 19px at 800 weight, and the lede moves to 20px in S1.2, so size joins weight in separating them.

L4 One border weight for framed cards. Before: specimen cards border 1.5px solid ink; code window and hero frame border 2px solid ink. After: 2px solid ink on specimen cards, radius and shadow unchanged. Source: impeccable / polish, same role components stay consistent across the page, and drift is fixed at the shared token level. This is the same correction as S1.9, extended.

L5 Slider and demo framing. Before: studio and AI demo frames use the shell radius with mixed inner padding, and the operation caption (.ai-op) uses a 1.5px dashed border in #E4C88F on a #FBF0D9 fill. After: demo frame radius 12px to match the corrected command strip family, inner padding 12px; .ai-op border none, background #F3DFB4, color #142832, padding 9px 12px, font-size 12.5px unchanged. Source: design-taste-frontend / colour, surfaces are separated by a small step in tone, never by a line; #F3DFB4 is one existing tone step from the ground. impeccable / craft-floor says the same: tint and tone before borders. The slider mechanics, the vertical divider, and every image stay untouched, per the standing rule for these demos.

L6 Dark section small text check and fix. Before: anatomy family label #9DB2C8 at 12px on #0D202E, and code comments #7E97AD at 14px on #0D202E. After: verify both in the build; any pairing under 4.5 to 1 moves to #DCE9F2, the section's existing full ink, with size unchanged. Source: impeccable / craft-floor, on colored surfaces tint secondary text from that surface's foreground rather than grey, and hold the 4.5 to 1 floor. No change is made to pairings that pass.

L7 Footer and closing panel. Before: closing documentation panel padding 34px 32px, footer padding as built. After: leave alone, except the S1.13 focus and selection values and the S1.5 button values, which apply here automatically through the shared tokens. Source: impeccable / polish, polish is refinement, never concealed redesign, and a region that already meets the floor is not reworked to make the pass visible.

## Leave alone, explicitly

- Typefaces and the font stack. No new face is loaded. Source: design-taste-frontend / type, one family is normal and the safest route to coherence, and impeccable / typeset preserves confirmed families and improves their use. The existing stack is worked harder in S1.1 to S1.3 instead.
- Page width and margins: max-width 1160px, padding 0 24px. Inside the 16 to 32px tight margin band in design-taste-frontend / layout. Leave alone.
- Hard offset shadows, shell radii, and the dotted paper texture. Confirmed brand devices from round 1. The craft floor warning on hard offset shadows applies to worlds that did not choose one; this world did, on the record in REEL-PASS.md.
- Monospace for operation labels, code, and the URL grammar. Real code and data are the stated exception in both design-taste-frontend house rules and impeccable / craft-floor. Leave alone.
- The coral second clause in headlines as a device. Only its color value changes, in S1.4.
- Snap artwork, the hero image crop, all demo images, and all slider mechanics, including the vertical before and after divider. Presentation of the frame changes in S1.8 and S1.10; the picture does not.
- The global reduced motion rule and the html.js entrance gate. Both already meet emil-design-eng on reduced motion: fewer and gentler, with content visible at rest.
- Button press scale, named transitions, and gated moving hovers from round 1. They already meet the Kowalski contract. Do not redo them.
- Ink, secondary ink, cream ground, and sand tone steps as a palette. The palette is not the problem; two of its values were used at sizes they cannot support, and S1.4 to S1.6 fix the use, not the palette.

## Craft floor checklist for the reviewer

Verify each line on the built Stage 1, at 1440px, 768px, and 390px.

- [ ] Contrast: coral text #C93A22 on #FBF0D9 reads 4.52 to 1 or better in a checker; white on the primary button #B92F1B reads 6.03 to 1; tidemark and Install links #0B6363 on cream read 6.23 to 1; lede #47606E on cream still reads 5.86 to 1.
- [ ] Contrast on dark: command strip code #DCE9F2 on #0D202E passes 4.5 to 1; the Copy button white on #18344A passes 4.5 to 1 in rest, hover, and copied states.
- [ ] Focus: every interactive element in the hero and Install regions shows the S1.13 ring on keyboard focus only, 3px with a 3px offset, sun on dark surfaces and coral deep on light ones, never removed and never shown on mouse click.
- [ ] Selection: selected text in both regions shows background #B92F1B with white text; selection inside the command strip remains legible against the dark ground.
- [ ] Press: primary button and Copy button both scale to 0.97 on :active and return over 160ms; no other Stage 1 control moves on press.
- [ ] Hover gating: no transform or shadow change in Stage 1 fires on a touch tap; the frame straightening in S1.10 exists only under (hover: hover) and (pointer: fine).
- [ ] Motion bans: no transition: all, no ease-in on any interface element, no animation over 300ms on a repeated interface move, no infinite animation anywhere in Stage 1, and nothing enters from scale(0).
- [ ] Reduced motion: with prefers-reduced-motion set, the hero and Install sections render complete at rest, the frame holds its static tilt, and entrances show content with no travel.
- [ ] Type: H1 holds two lines at 390px and 1440px with no overflow; lede measure stays within 45 to 75 characters; headings use text-wrap balance, body uses text-wrap pretty.
- [ ] Spacing: computed hero padding reads 64px top and 72px bottom; the gap between the hero and Install sections is larger than any gap inside either section; no inline padding override remains on the Install section.
- [ ] States: the Copy button shows rest, hover, focus, active, and copied states distinctly; the primary button disabled state, if triggered, keeps its label legible.
- [ ] Copy and structure diff: visible words, section order, element ids, and image sources are identical to the mirror before the build. Any difference fails the pass.
