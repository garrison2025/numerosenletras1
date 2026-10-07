# Numerosenletras.org — project design system

Status: project-specific baseline, matching the existing production visual language. Original content and approved keywords remain unchanged unless reviewed.

## Product and audience
- Product: fast Spanish cardinal and financial amount-to-words conversion, with secondary Unicode font tools.
- Main users: Spanish-speaking students, accountants, administrative staff and cheque/receipt writers.
- Primary task: enter a value, verify an accurate Spanish rendering, copy it.
- Personality: neutral, reliable, approachable, precise; avoid decorative "AI dashboard" styling.

## Theme and visual tokens (existing)
| Semantic token | Current base | Use |
|---|---|---|
| Canvas | gray-50 / #f9fafb | Site background |
| Surface | white / #fff | Main tools and editorial panels |
| Ink | gray-900 / #111827 | Headers/results |
| Body | gray-600 / #4b5563 | Explanations |
| Muted | gray-500 / #6b7280 | Captions |
| Hairline | gray-200 / #e5e7eb | Forms, dividers |
| Primary | blue-600 / #2563eb | General numbers and navigation |
| Finance | emerald-600 / #059669 | Financial calculator action emphasis |
| Secondary | indigo-600 / #4f46e5 | Accent and Unicode tools |
| Alert | amber-600 / #d97706 | Noncritical caveats |
| Error | red-600 / #dc2626 | Invalid input |

The primary action must be visually clearer than decorative hints. Preserve readable contrast; never represent errors only with color. Avoid new gratuitous gradients, blur or glass layers.

## Typography
- Display/body: system UI, Segoe UI, Arial; no downloaded font dependency.
- Numerical inputs, amounts and denominators: ui-monospace, Menlo, Consolas.
- Existing responsive hierarchy: hero 30–48px; H2 about 18–24px; body 14–16px; tool captions 12–14px.
- Financial result must be selectable and visible on narrow screens. Avoid 10px text for essential instructions.

## Spacing and geometry
- Existing container: main tools max-w-4xl, site chrome max-w-7xl.
- Base spacing: 4px increments. Mobile outer padding 16px, desktop 24–32px.
- Small controls rounded-lg (~8px), input rounded-2xl (~16px), major card rounded-3xl (~24px).
- Prefer borders and consistent padding over layered shadows.

## Components and states
- Header: sticky navigation with discoverable mobile menu; semantic links.
- Primary tool: input first, settings second, output and copy in clear focus order.
- Grouping switch LA/ES: switching must **preserve numerical meaning**, not simply reinterpret a string.
- Input: label, sample placeholder, clear focus ring, aria-invalid and plain-language error states.
- Output: selectable result; controls must reject invalid input for copy/share/print.
- Copy/share: confirm successful clipboard write, offer a useful failure message.
- History/favorites: optional only after explicit preference consent, never essential to conversion.
- Empty/error: clear blank output on empty input; invalid inputs get actionable explanation.
- Keyboard: normal tab sequence, visible focus, Ctrl/Cmd+C only when not interfering with selection.
- No empty or misleading disabled controls.

## Imagery / motion / responsive
- Use the three existing relevant editorial webp assets; no irrelevant stock imagery.
- Icon family: Lucide; accessible button names needed when the icon is alone.
- Existing hover transitions are ~150–300ms; respect prefers-reduced-motion.
- Mobile (<640px): input, selectors, action buttons stack with no horizontal overflow.
- Tablet (640–1023px): responsive 2-column settings where useful.
- Desktop (>=1024px): generous reading width; no needless sidebars.
- Print: cheque print media styles must not show navigation or floating controls.

## Design references and guardrails
- Structural references: familiar calculator field/result pattern; familiar banking cheque amount pattern; RAE/ASALE reference content clarity. These are patterns to compare, not brands to clone.
- Required review reference for future design revisions: VoltAgent/awesome-design-md.
- Avoid false official seals, fabricated testimonials, misleading certification claims and fake data badges.
- Changes to the visual language require updating this file and mobile screenshots first.

## QA checklist
Inspect at 360, 390, 768, 1024 and 1440px: first-screen conversion task, input keyboard, error feedback, country switch, history consent, menu, copy, long financial output, scroll and print. Visual checks require a real browser; static CI alone is insufficient.
