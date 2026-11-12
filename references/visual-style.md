# Visual style

The look is calm and plain: a bright white page, dark navy type, one warm highlight, generous space, large words. Nothing is decorative; every mark means something.

## Canvas

- Fixed **1920 × 1080** stage, laid out in pixels, scaled to the window. What you size is what a 1080p projector shows.
- Side margins **120 px**. Content width **1680 px**.
- Vertical bands: eyebrow at 50 · title from 96 · content from 260 to about 990 · hairline at 1004 · page number at the bottom right.
- The content band starts below a **two-line** title, so a long title never runs into the content.
- Leave air. If the content fills less than the band, make the main visual bigger; do not add words.

## Colour: one job each

| Token | Default | Job |
|---|---|---|
| `--ink` | `#00274c` navy | Text; finished work; the step being explained |
| `--accent` | `#ffcb05` maize | The single warm highlight: "So", "New", the deciding question, the "now" dot |
| `--ok` | `#2f65d8` blue | What is established (summary box edge) |
| `--warn` | `#d84a3a` coral | Skipped, unresolved, "not yet" — and nothing else |
| `--soft`, `--soft-ok`, `--soft-warn` | pale tints | Quiet fills behind a visual or a summary box |
| `--muted` | `#536577` | Labels and secondary text |
| `--line` | `#cbd6df` | Hairlines, card borders |
| `--paper` | `#ffffff` | Slide background |

Rules:

- For another institution, swap the values and keep the jobs. One dark, one warm, one "established", one "problem".
- A colour means the same thing on every slide. If coral means "skipped" on slide 1 it cannot mean "important" on slide 3.
- The legend swatch is drawn with the same fill and border as the thing it explains. Check this after any restyle.
- Never rely on colour alone: skipped boxes are also **dashed** and labelled "Skipped".
- At any moment only one area is fully saturated — the thing being explained.
- No gradients, glows, glass effects, drop caps, stock icons or clip art. Shadows are soft and only on cards that sit above the page.

## Type

| Role | Font | Size (px) | Notes |
|---|---|---:|---|
| Title (claim) | Georgia, serif, bold | 60–68 | Line height 1.04, slightly tight tracking, at most two lines |
| Eyebrow / small label | sans, 800, uppercase, tracked .11–.13em | 21–25 | Muted colour; a short maize bar before the eyebrow |
| Box heading | sans, 750 | 29–34 | Centred inside process boxes |
| Body phrase / list item | sans | 32–40 | The default reading size |
| Secondary line | sans, regular | 24–28 | Examples, units, "lower priority" |
| Summary phrase | sans, 750 | 31–34 | |
| Big answer ("All good?") | sans or serif, bold | 44–54 | |
| Page number | sans, 700 | 18 | The only text under 20 |

- Serif is for claims only: the title, a card's name, a one-line verdict. Everything else is sans.
- System fonts only (Georgia; Inter if installed, else Helvetica/Arial). No web-font downloads: the deck must open offline.
- When text does not fit, **cut words first**, then split the click, then move detail to notes. Do not go below the sizes above.

## Shapes

- Radius **18 px** on boxes, cards and panels; 5 px on small tags.
- Process box: filled navy with white text and a maize status line when done or active; dashed coral outline on pale coral when skipped; navy outline on white for a result; maize fill for the deciding question.
- Arrows: 4 px navy strokes with a small filled head; dashed coral for a "go back" path.
- Cards for people: white, 2 px border, a 12 px top band (navy for one person, maize for the other), serif name, uppercase role, 4–5 short actions.
- Strip for something on hold: full-width navy, label in maize, verdict large, reason beside it.
- Tag "New": small maize pill, uppercase.

## Layout patterns

| Pattern | Use it for | Build |
|---|---|---|
| **Timeline** | How we got here | Four dots on a hairline, heading + one phrase each; the last dot ("Now") in maize |
| **Process with gaps** | Why the result is a draft | 5–6 equal boxes in a row with arrows; done filled, skipped dashed; legend top right |
| **Three-box summary** | Closing a part | Solid (blue edge) · Not (coral edge) · So (maize fill), one click each |
| **Loop** | All open work in one place | Step heads in a row; a detail panel under the active step; then a check box, a "yes" path and a dashed "not yet" path |
| **Detail panel** | What a step involves | White card under the step heads; 3–4 numbered questions, bold question + small note; leaves on the next click |
| **Picture panel** | A step that is one idea | A simple drawn object → a verdict card, instead of a list |
| **Who does what** | Next steps | Two balanced cards side by side, strip underneath for what is on hold |
| **Before → after** | A change in a model or figure | Two large visuals on a shared baseline, one arrow, one question underneath |

A table of step / status / owner / remaining work is almost always better drawn as a process with gaps.

## Focus

- When a new step becomes active, earlier steps stay in place but drop to about 28% opacity and lose their colour. The eye should have one place to go.
- A detail that has been explained leaves the slide when the next one arrives, so the slide never holds two details at once.
- The final state of a slide should read as the summary of the whole slide, not as a pile of everything shown.

## Check by eye

Before calling a slide finished, look at the rendered image and ask:

1. From the back of the room, can I read every word?
2. Where does my eye land first — and is that the point of this click?
3. Is anything touching, overlapping, or clipped? Is the title clear of the content?
4. Are the boxes in a row the same height, on the same baseline, evenly spaced?
5. Is there a big empty area with small content next to it? Enlarge the content.
6. Does every colour on the slide have its usual meaning?
