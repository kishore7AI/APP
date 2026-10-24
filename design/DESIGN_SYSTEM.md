# NxtLearnn — Design System Specification
### "Celestial Horizon" Visual Architecture (Inspired by `design/landing_page_ref.png`)

This document defines the unified design system, color tokens, layout hierarchy, and component conventions to be used across the entire NxtLearnn platform (Landing, Course Catalog, Classroom Player, Dashboard, and Admin Studio).

---

## 1. Aesthetic Identity & Core Principles

- **Mood:** Cosmic, premium, high-tech, razor-sharp focus.
- **Atmosphere:** Deep obsidian navy void (`#030712`) with an ethereal cyan/indigo planetary horizon glow (`#38bdf8` / `#6366f1`), glowing starlight badges, and ultra-crisp glassmorphism.
- **Hierarchy:** Dramatic contrast between pure white headings, soft muted slate paragraphs, glowing interactive accents, and luminous primary action pills.

---

## 2. Color Palette & Design Tokens

### Backgrounds & Surfaces
| Token | Hex / Value | Usage |
|---|---|---|
| `bg-void` | `#030712` | Root page background (Deepest Obsidian) |
| `bg-nebula` | `#070c1b` | Elevated surface / section backdrop |
| `bg-card` | `rgba(14, 20, 36, 0.75)` | Glassmorphic card surface |
| `border-subtle` | `rgba(255, 255, 255, 0.08)` | Standard card and container outline |
| `border-glow` | `rgba(99, 102, 241, 0.35)` | Active / hovered card outline |

### Celestial Glow Accents
| Token | Hex / Value | Usage |
|---|---|---|
| `glow-cyan` | `#38bdf8` | Horizon top corona arc, secondary neon glow |
| `glow-indigo` | `#6366f1` | Primary brand accent, button gradients |
| `glow-violet` | `#8b5cf6` | Highlight gradients, text sheen |

### Typography & Text Colors
| Role | Class / Color | Usage |
|---|---|---|
| Hero Title | `text-white font-extrabold tracking-tight` | Dominant display text |
| Gradient Sheen | `bg-gradient-to-r from-white via-indigo-200 to-sky-300 bg-clip-text text-transparent` | Sub-headline accentuation |
| Body Text | `text-slate-400 font-normal leading-relaxed` | Readable descriptions |
| Sub-meta | `text-slate-500 font-mono text-xs` | Durations, lesson counters |

---

## 3. Component Architecture & Directory Conventions

```
frontend/src/
├── components/
│   ├── ui/                    # Atomic, reusable primitives (shadcn standard)
│   │   ├── testimonial-v2.jsx # Infinite loop moving marquee testimonials
│   │   ├── button.jsx         # Celestial pill & glass buttons
│   │   ├── badge.jsx          # Star-illuminated status pill
│   │   └── card.jsx           # Glass container with ambient hover glow
│   │
│   ├── Navbar.jsx             # Fixed frosted celestial nav with logo & role actions
│   ├── Footer.jsx             # Grounded cosmic footer
│   ├── VideoPlayer.jsx        # ImageKit HLS player with adaptive streaming
│   └── CourseCard.jsx         # Course preview card with glass styling
│
├── pages/                     # Full-page compositions
│   ├── marketing/             # Landing, Courses, Pricing
│   ├── student/               # Classroom & Dashboard
│   └── admin/                 # Creator Studio
```

### Why `/components/ui` is Standard
In modern React architecture (popularized by shadcn/ui), `/components/ui` houses **primitives** (buttons, badges, modals, animated marquee columns) that are completely decoupled from domain business logic. Page-specific and compound components reside in `/components/`, ensuring maximum reusability and clean maintainability.

---

## 4. Celestial Horizon Arc Implementation

The signature visual element from `landing_page_ref.png` is the curved luminous planetary arc:
```html
<!-- Ambient Arc Background -->
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] pointer-events-none overflow-hidden -z-10">
  <!-- Glowing Horizon Ring -->
  <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[800px] md:w-[1050px] h-[360px] rounded-[100%] border-t-2 border-sky-400/80 shadow-[0_-25px_80px_rgba(56,189,248,0.45)]" />
  <!-- Indigo Nebula Ambient Flare -->
  <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-gradient-to-b from-indigo-500/25 to-transparent blur-[90px] rounded-full" />
</div>
```

---

## 5. Button Hierarchy

1. **Primary Celestial Pill ("Get Started"):**
   - Background: Solid brilliant white (`#ffffff`).
   - Text: Dark obsidian (`#030712`), font-bold.
   - Glow: `shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)]`.
   - Shape: Fully rounded pill (`rounded-full px-7 py-3`).

2. **Secondary Frosted Glass Pill ("Watch Demo" / "Explore Courses"):**
   - Background: `bg-white/[0.06] hover:bg-white/[0.12]`.
   - Text: `text-white font-medium`.
   - Border: `border border-white/15 hover:border-white/30`.
   - Shape: `rounded-full px-7 py-3 backdrop-blur-md`.

---

## 6. Global Implementation Plan

All subsequent pages and components (Course Catalog, Lesson Player, Student Dashboard, Admin Studio) will inherit this design system token set, ensuring a cohesive, breathtaking user experience throughout NxtLearnn.
