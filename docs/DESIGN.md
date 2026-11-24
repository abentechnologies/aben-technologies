---
name: Kinetic Industrial Brutalism
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e3bfb1'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#aa8a7d'
  outline-variant: '#5a4136'
  surface-tint: '#ffb596'
  primary: '#ffb596'
  on-primary: '#581e00'
  primary-container: '#ff6500'
  on-primary-container: '#551d00'
  inverse-primary: '#a33e00'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#9dcaff'
  on-tertiary: '#003257'
  tertiary-container: '#009bfe'
  on-tertiary-container: '#003155'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcd'
  primary-fixed-dim: '#ffb596'
  on-primary-fixed: '#360f00'
  on-primary-fixed-variant: '#7d2d00'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#d1e4ff'
  tertiary-fixed-dim: '#9dcaff'
  on-tertiary-fixed: '#001d36'
  on-tertiary-fixed-variant: '#00497c'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-xl:
    fontFamily: Clash Display, Unbounded
    fontSize: 72px
    fontWeight: '800'
    lineHeight: 76px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Clash Display, Unbounded
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Clash Display, Unbounded
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Clash Display, Unbounded
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Clash Display, Unbounded
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  title-lg:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-code:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-mono-sm:
    fontFamily: Space Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.12em
spacing:
  gutter: 1rem
  gutter-mobile: 0.5rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 3rem
---

## Brand & Style
This design system defines an uncompromising, hyper-functional aesthetic for high-performance experimental engineering and physical-digital infrastructure. The target audience comprises advanced systems architects, hardware engineers, quantitative researchers, and technical operators who demand raw data density, zero latency perception, and definitive visual hierarchy.

The design movement combines **Neo-Brutalism** with **Industrial Heavy Machinery Telemetry**:
- **Radical Functionalism:** Content is structural. Layout grids are exposed as visible structural joints rather than hidden guidelines.
- **Physical Caution Accents:** High-visibility safety motifs, hazard striping, indexing coordinates, and terminal status indicators evoke aerospace testing bays and high-voltage manufacturing cells.
- **Tactile Directness:** Zero skeuomorphic fluff, zero soft gradients, and zero decorative drop shadows. Surfaces communicate through high-contrast boundary lines, flat fills, and raw geometric tension.

## Colors
The palette is calibrated strictly around physical industrial high-visibility constraints:
- **Neutral (`#050505`):** Carbon Core Black. Used as the universal canvas, heavy framing, and inverse text container. It provides an absolute void against which signal colors ignite.
- **Primary (`#FF6500`):** Safety Kinetic Orange. Reserved for operational alerts, focused input borders, critical system triggers, and active status conduits. It acts as an eye-commanding beacon across vast arrays of data.
- **Secondary (`#FFFFFF`):** High-Luminance Crisp White. Used for primary structural typography, prominent card boundaries, and raw structural dividers to deliver maximum readability against the `#050505` substrate.
- **Tertiary Accent (`#1E1E1E` & `#2D1200`):** Structural Grid Steel & Orange Heat Underlay. Used solely for subtle sub-grid matrices, disabled machine states, and striped warning fills.

Apply color with hard-edge binary splits: no color blending, no opacity-faded color washes, and no blurred ambient glows.

## Typography
The typographic hierarchy creates tension between monumental display impact and microscopic surgical precision:
- **Headlines & Mastheads (`Syne`):** Extra-bold, wide-tracked or condensed display forms. Always set tight with minimal leading. Headlines command attention with monolithic weight, mimicking die-cast metal signage.
- **Narrative & Body (`Space Grotesk`):** Mechanical, geometric, and functional. Retains legibility at fast scanning speeds while sustaining a distinct utilitarian edge.
- **Micro-Copy, Data & Telemetry (`Space Mono`):** All caps, monospaced layout indices, status codes (`[SYS_OK]`, `//001-ALPHA`), timestamps, and column labels. Letter-spacing is widened to optimize legibility under dense hardware readouts.

## Layout & Spacing
The layout follows a rigid 12-column exposed engineering grid built on an absolute 8px modular baseline:
- **Exposed Structural Grid:** Columns and sections are segmented with hard `1px` or `2px` solid divider lines. Grid gutters operate as explicit structural clearances.
- **Breakpoints:**
  - **Desktop (1280px+):** 12-column layout, outer canvas margins fixed at `2rem`, component inner paddings strictly stepped by `0.5rem` / `1rem` / `1.5rem`.
  - **Tablet (768px - 1279px):** 6-column fluid structure, gutters standard at `1rem`, secondary data panels fold into stacked accordions with distinct tabular rules.
  - **Mobile (< 768px):** 2 or 4-column compact layout. Gutters compress to `0.5rem`, margin to `1rem`. All multi-column toolbars break into vertical stacked mechanical strips.
- **Data Density:** Layout elements avoid excessive negative space. High-density grouping within bordered clusters signals machine efficiency.

## Elevation & Depth
Depth is strictly planimetric and non-atmospheric. There are **zero blurred drop-shadows**, zero diffused glows, and zero glassmorphic blurs in this system.

Elevation is achieved through three deliberate brutalist techniques:
1. **Hard Wireframe Offsets (Physical Cast Shadow):** Raised components (e.g., active cards, elevated callouts, hovered elements) utilize hard-edge offsets: `box-shadow: 4px 4px 0px #FF6500` or `box-shadow: 4px 4px 0px #FFFFFF`. No blur radius is ever permitted.
2. **Inverted Surface Boundaries:** Active layers elevate above background planes by shifting from pure black `#050505` to stark white `#FFFFFF` or safety orange `#FF6500`, with all child text instantly flipping contrast inversion.
3. **Hazard Framing & Layer Cutouts:** Overlapping telemetry displays feature 45-degree chamfered corners or industrial hazard cross-hatching (`repeating-linear-gradient(45deg, #050505, #050505 10px, #FF6500 10px, #FF6500 20px)`) to establish visual priority on critical warnings.

## Shapes
Sharpness is absolute:
- **Zero Radius:** All corners are engineered at `0px` (`roundedness: 0`). Buttons, input panels, badges, modal dialogs, and image viewports exist exclusively with razor-sharp 90-degree junctions.
- **Chamfer Accents:** As a secondary geometric variation for technical widgets, use CSS `clip-path` angled cuts (e.g., `polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)`) to replicate laser-cut steel plates and structural avionics enclosures.
- **Linework:** Borders are solid, deliberate, and structural: either hairline `1px` for baseline grid containment or authoritative `2px` / `3px` for interactive focus boundaries.

## Components

### Buttons
- **Primary Industrial:** Solid `#FF6500` background, `#050505` text in `Space Grotesk` Bold uppercase. Sharp `0px` radius. Hover state: `transform: translate(-2px, -2px)` with a hard shadow `box-shadow: 4px 4px 0px #FFFFFF`. Active: `translate(0, 0)`.
- **Secondary Frame:** `#050505` background, `2px solid #FFFFFF` border, `#FFFFFF` text. Hover state: fills completely `#FFFFFF` with `#050505` text.
- **Terminal Danger/Override:** Diagonal safety hazard stripe background (`#FF6500` and `#050505`), high-visibility text container, pulsing terminal status indicator prefix `[ ! ]`.

### Chips & Metadata Badges
- Boxed in `1px solid #FFFFFF` or `1px solid #FF6500`.
- Micro typography in `Space Mono` (`10px` or `12px`), uppercase.
- Prefix elements include physical glyph indicators: `[RAW]`, `//01`, or a filled geometric square `■`.

### Lists & Telemetry Tables
- Row structures separated by exposed `1px solid #1E1E1E` or `1px solid #FFFFFF` dividers.
- Hovering a row triggers an immediate full-width invert: `#050505` flips to `#FFFFFF` with `#050505` text, or `#FF6500` highlight edge on the left margin (`4px solid #FF6500`).
- Monospaced numeric alignment (`tabular-nums`) with explicit column header index markers (`#ID`, `SPEC`, `THROUGHPUT`, `STATUS`).

### Checkboxes & Radio Controls
- **Checkbox:** `16x16px` square, `0px` radius, `2px solid #FFFFFF`. Checked state: solid `#FF6500` center or sharp high-contrast cross `✕` in pure white.
- **Radio Buttons:** `16x16px` diamond geometry (rotated 45-degree square) or sharp square-in-square enclosure to avoid organic curves.

### Input Fields
- Dark canvas background `#050505` encased in a `1px solid #FFFFFF` border.
- Text rendered in `Space Grotesk` or `Space Mono`.
- Placeholder text in muted `#666666` prefixed by command prompt carats `> `.
- Focus state: `2px solid #FF6500` with hard offset box-shadow `2px 2px 0px #FF6500`.

### Cards & Industrial Modules
- Monolithic bounding boxes with `1px solid #FFFFFF` borders and zero radius.
- Headers are visually compartmentalized using a top-affixed label band (`padding: 4px 8px`, `background: #FFFFFF`, `color: #050505`, uppercase `Space Mono`).
- Optional technical registration marks on outer corners (crosshairs `+` in four corners) reinforcing the experimental blueprint aesthetic.

### Hazard Tape Ribbons (Specialty Component)
- High-visibility banner used for deployment locks, breaking alerts, or system maintenance notices.
- Alternating 45-degree hazard stripes (`#FF6500` and `#050505`) with a bold centered marquee in black-on-white high-contrast block labels.